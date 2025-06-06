import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Select,
  InputGroup,
  ChakraDatePicker,
  EditorTemplate,
  useMarkdownEditor,
  MarkdownEditor,
  Banner,
  FormControlled,
  useFormErrorHandler,
} from "@yukilabs/governance-components";
import { useWalletClient } from "wagmi";
import { trpc } from "src/utils/trpc";
import { providers } from "ethers";
import { navigate } from "vite-plugin-ssr/client/router";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "src/hooks/useFileUpload";
import { useState } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { FormLayout } from "src/components/FormsCommon/FormLayout";
import { AUTHENTICATORS_ENUM } from "../../hooks/snapshotX/constants";
import { useSpace } from "../../hooks/snapshotX/useSpace";
import {
  pinPineapple,
  prepareStrategiesForSignature,
  waitForTransaction,
} from "../../hooks/snapshotX/helpers";
import {
  ethSigClient,
  starkProvider,
  starkSigClient,
} from "../../clients/clients";
import { useProposals } from "../../hooks/snapshotX/useProposals";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWallets } from "../../hooks/useWallets";

interface FieldValues {
  // type: ProposalType;
  // choices: string[];
  title: string;
  body: any[];
  discussion: string;
  votingPeriod: Date[];
}

export function Page() {
  const { data: walletClient } = useWalletClient();
  const { primaryWallet } = useDynamicContext();
  const { ethWallet, starknetWallet } = useWallets();
  const { editor, handleEditorChange, editorValue } = useMarkdownEditor("");
  const { handleUpload } = useFileUpload();
  const [error, setError] = useState("");
  const { data: allProposals, refetch: refetchProposals } = useProposals();
  const { walletConnector } = useDynamicContext();
  const createProposal = trpc.proposals.createProposal.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(now.getDate() + 3);

  const {
    handleSubmit,
    control,
    register,
    trigger,
    formState: { errors },
  } = useForm<FieldValues>({
    async defaultValues() {
      return {
        title: "",
        body: EditorTemplate.proposalMarkDown,
        discussion: "",
        votingPeriod: [now, threeDaysFromNow],
      };
    },
    shouldFocusError: false,
  });

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;
    return strTime;
  };

  const [selectedTime, setSelectedTime] = useState<string[] | null>([
    formatTime(now),
    formatTime(threeDaysFromNow),
  ]);

  const space = useSpace();

  const handleEditorChangeWrapper = (value) => {
    handleEditorChange(value);
    if (errors.body) {
      trigger("body");
    }
  };

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        setIsSubmitting(true);
        if (walletClient == null) return;

        const pinned = await pinPineapple({
          title: data.title,
          body: editorValue,
          discussion: data.discussion,
          execution: [],
        });
        if (!pinned || !pinned.cid) return false;
        console.log("IPFS", pinned);
        // PREPARE DATA HERE
        const strategiesMetadata =
          space.data.voting_power_validation_strategies_parsed_metadata.map(
            (strategy) => ({
              ...strategy.data,
            }),
          );
        const preparedStrategies = await prepareStrategiesForSignature(
          space.data.voting_power_validation_strategy_strategies as string[],
          strategiesMetadata as any[],
        );

        const params = {
          authenticator:
            primaryWallet?.id === ethWallet?.id
              ? AUTHENTICATORS_ENUM.EVM_SIGNATURE
              : AUTHENTICATORS_ENUM.STARKNET_SIGNATURE,
          space: space.data.id,
          executionStrategy: {
            addr: "0x0000000000000000000000000000000000000000",
            params: [],
          },
          strategies: preparedStrategies,
          metadataUri: `ipfs://${pinned.cid}`,
        };

        const web3 = new providers.Web3Provider(walletClient.transport);
        const deeplink = walletConnector?.getDeepLink();
        if (deeplink) {
          window.location.href = deeplink;
        }
        let receipt = null;
        if (primaryWallet?.id === ethWallet?.id) {
          receipt = await ethSigClient.propose({
            signer: web3.getSigner(),
            data: params,
          });
        } else {
          if (typeof window !== "undefined") {
            const isBraavos = starknetWallet?.connector?.name === "Braavos";
            let activeStarknetAccount = null;
            if (isBraavos) {
              activeStarknetAccount = window?.starknet_braavos?.account;
            } else {
              activeStarknetAccount = window?.starknet?.account;
            }
            receipt = await starkSigClient.propose({
              signer: activeStarknetAccount,
              data: params,
            });
          }
        }
        const transaction = await starkSigClient.send(receipt);
        console.log(receipt);
        console.log(transaction);
        if (!transaction.transaction_hash) {
          setError("Error creating proposal");
          return false;
        }
        try {
          const result = await waitForTransaction(transaction.transaction_hash);
          setIsSubmitting(false);
          setError("");
          await refetchProposals();
          navigate("/voting-proposals");
          /*
          await createProposal
            .mutateAsync(proposalData)
            .then(() => {
              setError("");
              navigate(`/voting-proposals/${receipt.id}`);
              setIsSubmitting(false);
            })
            .catch((err) => {
              setIsSubmitting(false);
            });

           */
        } catch (error) {
          // Handle error
          console.log(error);
          setIsSubmitting(false);
          // error.description is actual error from snapshot
        }
      } catch (error: any) {
        // Handle error
        console.log(error);
        setIsSubmitting(false);
        setError(`Error: ${error?.error_description || error?.message}`);
      }
    },
    () => onErrorSubmit(errors),
  );

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const { setErrorRef, scrollToError } = useFormErrorHandler([
    "title",
    "body",
    "votingPeriod",
  ]);

  const onErrorSubmit = (errors) => {
    if (Object.keys(errors).length > 0) {
      scrollToError(errors);
    }
  };

  return (
    <>
      <FormLayout>
        <Heading variant="h3" mb="24px">
          Create voting proposal
        </Heading>
        <form onSubmit={onSubmit} noValidate>
          <Stack spacing="standard.xl" direction={{ base: "column" }}>
            <FormControlled
              name="title"
              label="Title"
              isRequired
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message || "Add proposal name"}
              ref={(ref) => setErrorRef("title", ref)}
            >
              <Input
                isInvalid={!!errors.title}
                variant="primary"
                size="standard"
                placeholder="Briefly describe the proposal"
                {...register("title", {
                  required: true,
                })}
              />
            </FormControlled>
            <FormControlled
              name="body"
              label="Proposal Body"
              isRequired
              isInvalid={!!errors.body}
              errorMessage={errors.body?.message || "Describe your proposal"}
              ref={(ref) => setErrorRef("body", ref)}
            >
              <Controller
                control={control}
                name="body"
                rules={{
                  validate: {
                    required: (value) => {
                      const trimmedValue = editorValue?.trim();
                      if (!trimmedValue?.length) {
                        return "Describe your proposal";
                      }
                    },
                  },
                }}
                render={() => (
                  <MarkdownEditor
                    isInvalid={!!errors.body}
                    offsetPlaceholder={"-8px"}
                    placeholder={`
Overview
Motivation
Specification
Implementation
Links
                `}
                    customEditor={editor}
                    onChange={handleEditorChangeWrapper}
                    value={editorValue}
                    handleUpload={handleUpload}
                  />
                )}
              />
            </FormControlled>

            <FormControlled
              name="discussion"
              label="Forum discussion"
              isInvalid={!!errors.discussion}
              errorMessage={
                errors.discussion?.message || "Please enter a valid URL."
              }
            >
              <InputGroup maxW={{ md: "3xl" }}>
                <Input
                  placeholder="https://"
                  size="standard"
                  variant="primary"
                  defaultValue=""
                  {...register("discussion", {
                    validate: (value) => {
                      if (!value || !value.length || isValidURL(value)) {
                        return true;
                      } else {
                        return "Please enter a valid URL.";
                      }
                    },
                  })}
                />
              </InputGroup>
            </FormControlled>

            <Heading color="content.accent.default" variant="h3" mt="20px">
              Voting
            </Heading>

            {/* // disabled for basic voting */}
            <FormControlled isRequired name="votingType" label="Voting type">
              <Select
                size="md"
                isReadOnly
                defaultValue="basic"
                options={[{ label: "Basic", value: "basic" }]}
                onChange={() => console.log("changed")}
                placeholder="Basic"
              />
            </FormControlled>

            {/* // disabled for basic voting */}
            <FormControlled isRequired name="choices" label="Choices">
              <Select
                size="md"
                isReadOnly
                defaultValue="basic"
                options={[{ label: "Basic", value: "basic" }]}
                onChange={() => console.log("changed")}
                placeholder="Basic"
              />
            </FormControlled>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                width={{ base: "100%", md: "auto" }}
                size="standard"
                variant="primary"
                disabled={isSubmitting}
              >
                <Flex alignItems="center" gap={2}>
                  {isSubmitting && <Spinner size="sm" />}
                  <div>Create voting proposal</div>
                </Flex>
              </Button>
            </Box>
            {error && error.length && (
              <Banner label={error} variant="error" type="error" />
            )}
          </Stack>
        </form>
      </FormLayout>
    </>
  );
}

export const documentProps = {
  title: "Vote / Create",
  image: "/social/social-proposal.png",
} satisfies DocumentProps;
