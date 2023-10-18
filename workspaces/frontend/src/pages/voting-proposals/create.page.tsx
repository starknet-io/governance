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
  ContentContainer,
  EditorTemplate,
  useMarkdownEditor,
  MarkdownEditor,
  Banner,
  FormControlled,
  useFormErrorHandler,
} from "@yukilabs/governance-components";
import snapshot from "@snapshot-labs/snapshot.js";
import { useWalletClient } from "wagmi";
import { trpc } from "src/utils/trpc";
import { fetchBlockNumber } from "@wagmi/core";
import { providers } from "ethers";
import { Proposal } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { navigate } from "vite-plugin-ssr/client/router";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "src/hooks/useFileUpload";
import { useState } from "react";
import { Flex, Spinner } from "@chakra-ui/react";

interface FieldValues {
  // type: ProposalType;
  // choices: string[];
  category: string;
  title: string;
  body: any[];
  discussion: string;
  votingPeriod: Date[];
}

const categories = ["category1", "category2", "category3"];

export function Page() {
  const { data: walletClient } = useWalletClient();
  const { editor, handleEditorChange, editorValue } = useMarkdownEditor("");
  const { handleUpload } = useFileUpload();
  const [error, setError] = useState("");

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
        category: categories[0],
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

        const client = new snapshot.Client712(
          import.meta.env.VITE_APP_SNAPSHOT_URL,
        );

        const block = await fetchBlockNumber({
          chainId: parseInt(import.meta.env.VITE_APP_SNAPSHOT_CHAIN_ID),
        });

        const params: Proposal & {
          categories: Array<string>;
          votingPeriod?: Date[];
        } = {
          space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
          type: "basic",
          title: data.title,
          body: editorValue,
          choices: ["For", "Against", "Abstain"],
          start: Math.floor(data!.votingPeriod[0].getTime() / 1000),
          end: Math.floor(data!.votingPeriod[1].getTime() / 1000),
          categories,
          snapshot: Number(block),
          plugins: JSON.stringify({}),
          discussion: data.discussion,
        };

        const web3 = new providers.Web3Provider(walletClient.transport);

        const receipt = (await client.proposal(
          web3,
          walletClient.account.address,
          params,
        )) as any;

        type CategoryType = "category1" | "category2" | "category3";
        const proposalData = {
          title: data.title,
          discussion: data.discussion,
          proposalId: receipt.id,
        };

        try {
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
        } catch (error) {
          // Handle error

          setIsSubmitting(false);
          // error.description is actual error from snapshot
        }
      } catch (error: any) {
        // Handle error
        setIsSubmitting(false);
        setError(`Error: ${error?.error_description}`);
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
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
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
              <FormControlled name="category" label="Category">
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      {...field}
                      isInvalid={!!errors.category}
                      options={categories.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                      value={field.value as any}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </FormControlled>
              <Heading color="content.accent.default" variant="h3" mt="20px">
                Voting
              </Heading>

              {/* // disabled for basic voting */}
              <FormControlled isRequired name="votingType" label="Voting type">
                <Select
                  size="md"
                  isReadOnly
                  defaultValue="option1"
                  options={[{ label: "Basic", value: "desc" }]}
                  onChange={() => console.log("changed")}
                  placeholder="Basic"
                />
              </FormControlled>

              {/* // disabled for basic voting */}
              <FormControlled isRequired name="choices" label="Choices">
                <Select
                  size="md"
                  isReadOnly
                  defaultValue="option1"
                  options={[{ label: "Basic", value: "desc" }]}
                  onChange={() => console.log("changed")}
                  placeholder="For"
                />
              </FormControlled>

              <FormControlled
                name="votingPeriod"
                label="Voting period"
                isRequired
                errorMessage={errors?.votingPeriod?.message}
                isInvalid={!!errors.votingPeriod}
                ref={(ref) => setErrorRef("votingPeriod", ref)}
              >
                <Stack spacing="12px" direction={{ base: "row" }}>
                  <Box width="100%">
                    <Controller
                      control={control}
                      name="votingPeriod"
                      rules={{
                        required: "Voting period is required.",
                        validate: (value) => {
                          // Check if both start and end dates are selected
                          if (
                            !value ||
                            value.length !== 2 ||
                            !value[0] ||
                            !value[1]
                          ) {
                            return "Both start and end dates are required.";
                          }
                          // Check if start date/time is before the end date/time
                          else if (value[0] >= value[1]) {
                            return "Start date/time must be before the end date/time.";
                          }
                          // If user didn't select a time, use default
                          else if (!selectedTime || selectedTime.length !== 2) {
                            setSelectedTime(["12:00 AM", "12:00 AM"]);
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <ChakraDatePicker
                          single={false}
                          showTimePicker={true}
                          range={true}
                          date={field.value}
                          onDateChange={field.onChange}
                          isInvalid={fieldState.invalid}
                          errorMessage={fieldState?.error?.message}
                          selectedTime={selectedTime}
                          setSelectedTime={setSelectedTime}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </FormControlled>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  size="condensed"
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
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Vote / Create",
} satisfies DocumentProps;
