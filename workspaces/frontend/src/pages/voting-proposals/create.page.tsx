import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  InputGroup,
  ChakraDatePicker,
  ContentContainer,
  EditorTemplate,
  useMarkdownEditor,
  MarkdownEditor,
} from "@yukilabs/governance-components";
import snapshot from "@snapshot-labs/snapshot.js";
import { useWalletClient } from "wagmi";
import { trpc } from "src/utils/trpc";
import { fetchBlockNumber } from "@wagmi/core";
import { providers } from "ethers";
import { Proposal } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { navigate } from "vite-plugin-ssr/client/router";
import { useForm, Controller } from "react-hook-form";

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
  const { convertSlateToMarkdown } = useMarkdownEditor("");

  const createProposal = trpc.proposals.createProposal.useMutation();


  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm<FieldValues>({
    async defaultValues() {
      return {
        title: "",
        category: "",
        body: EditorTemplate.proposalMarkDown,
        discussion: "",
        votingPeriod: [new Date(), new Date()], // This will hold both start and end dates
      };
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (walletClient == null) return;

      const client = new snapshot.Client712(
        import.meta.env.VITE_APP_SNAPSHOT_URL,
      );

      const block = await fetchBlockNumber({
        chainId: parseInt(import.meta.env.VITE_APP_SNAPSHOT_CHAIN_ID),
      });

      console.log(block);

      const params: Proposal & { categories: Array<string>, votingPeriod?: Date[] } = {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        type: "basic",
        title: data.title,
        body: convertSlateToMarkdown(data.body),
        choices: ["For", "Against", "Abstain"],
        start: Math.floor(data!.votingPeriod[0].getTime() / 1000),
        end: Math.floor(data!.votingPeriod[1].getTime() / 1000),
        categories,
        snapshot: Number(block),
        plugins: JSON.stringify({}),
        discussion: data.discussion,
      }

      const web3 = new providers.Web3Provider(walletClient.transport);

      const receipt = (await client.proposal(
        web3,
        walletClient.account.address,
        params,
      )) as any;

      const proposalData = {
        category: data.category as "category1" | "category2" | "category3",
        proposalId: receipt.id,
      };

      try {
        await createProposal
          .mutateAsync(proposalData)
          .then(() => {
            navigate(`/voting-proposals/${receipt.id}`);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        // Handle error
        console.log(error);
      }

      console.log(receipt);

    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create voting proposal
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  variant="primary"
                  size="standard"
                  placeholder="Briefly describe the proposal"
                  {...register("title", {
                    required: true,
                  })}
                />
              </FormControl>
              <FormControl id="delegate-statement">
                <FormLabel>Proposal Body</FormLabel>{" "}
                <Controller
                  control={control}
                  name="body"
                  render={({ field: { onChange, value } }) => (
                    <MarkdownEditor onChange={onChange} value={value} />
                  )}
                />
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Forum discussion (optional) </FormLabel>

                <InputGroup maxW={{ md: "3xl" }}>
                  <Input
                    placeholder="https://"
                    size="standard"
                    variant="primary"
                    defaultValue=""
                    {...register("discussion", {})}
                  />
                </InputGroup>
              </FormControl>

              {/* // disabled for basic voting */}
              <FormControl id="starknet-wallet-address">
                <FormLabel>Voting type</FormLabel>
                <Select
                  placeholder="Select option"
                  disabled
                  defaultValue="option1"
                >
                  <option value="option1">Basic</option>
                </Select>
              </FormControl>
              <FormControl id="category">
                <FormLabel>Category</FormLabel>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select {...field}>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              {/* // disabled for basic voting */}
              <FormControl id="Choices">
                <FormLabel>Choices</FormLabel>
                <Stack spacing="12px" direction={{ base: "column" }}>
                  <Box
                    border="1px solid #E4E5E7 "
                    padding="10px 15px"
                    borderRadius="5px"
                  >
                    For
                  </Box>
                  <Box
                    border="1px solid #E4E5E7 "
                    padding="10px 15px"
                    borderRadius="5px"
                  >
                    Against
                  </Box>
                  <Box
                    border="1px solid #E4E5E7 "
                    padding="10px 15px"
                    borderRadius="5px"
                  >
                    Abstain
                  </Box>
                </Stack>
              </FormControl>
              <FormControl id="starknet-wallet-address">
                <FormLabel>Voting period</FormLabel>
                <Stack spacing="12px" direction={{ base: "row" }}>
                  <Box width="100%">
                    <Controller
                      control={control}
                      name="votingPeriod"
                      render={({ field: { onChange, value } }) => (
                        <ChakraDatePicker
                          single={false}
                          showTimePicker={true}
                          range={true}
                          date={value}
                          onDateChange={onChange}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  size="condensed"
                  variant="primary"
                  isDisabled={!isValid}
                >
                  Create voting proposal
                </Button>
              </Box>
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
