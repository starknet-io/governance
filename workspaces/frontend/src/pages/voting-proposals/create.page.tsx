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
  DatePicker,
  ContentContainer,
  EditorTemplate,
  useMarkdownEditor,
  MarkdownEditor,
} from "@yukilabs/governance-components";
import snapshot from "@snapshot-labs/snapshot.js";
import { useWalletClient } from "wagmi";
import { fetchBlockNumber } from "@wagmi/core";
import { providers } from "ethers";
import { Proposal } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { navigate } from "vite-plugin-ssr/client/router";
import { useForm, Controller } from "react-hook-form";

interface FieldValues {
  // type: ProposalType;
  // choices: string[];
  title: string;
  body: any[];
  discussion: string;
  start: Date | null;
  end: Date | null;
}

export function Page() {
  const { data: walletClient } = useWalletClient();
  const { convertSlateToMarkdown } = useMarkdownEditor("");

  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm<FieldValues>({
    async defaultValues() {
      return {
        title: "",
        body: EditorTemplate.proposalMarkDown,
        discussion: "",
        start: new Date(),
        end: new Date(new Date().getTime() + 3 * 60 * 60 * 24 * 1000),
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

      const params: Proposal = {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        type: "basic",
        title: data.title,
        body: convertSlateToMarkdown(data.body),
        choices: ["For", "Against", "Abstain"],
        start: Math.floor(data.start!.getTime() / 1000),
        end: Math.floor(data.end!.getTime() / 1000),
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

      console.log(receipt);

      navigate(`/voting-proposals/${receipt.id}`);
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
                  placeholder="Briefly describe proposal"
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
                    <MarkdownEditor
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Forum discussion (optional) </FormLabel>

                <InputGroup maxW={{ md: "3xl" }}>
                  <Input
                    variant="primary"
                    defaultValue="https://community.starknet.io/1234567890"
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
                      name="start"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DatePicker
                          onChange={(value) => onChange(value)}
                          onBlur={onBlur}
                          selected={value}
                          required
                          showPopperArrow={true}
                        />
                      )}
                    />
                  </Box>
                  <Box width="100%">
                    <Controller
                      control={control}
                      name="end"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DatePicker
                          onChangeRaw={onChange}
                          onChange={(value) => onChange(value)}
                          onBlur={onBlur}
                          selected={value}
                          required
                          showPopperArrow={true}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
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

// import { DocumentProps } from "src/renderer/types";

// import {
//   Box,
//   Button,
//   Heading,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Select,
//   InputGroup,
//   MarkdownEditor,
//   DatePicker,
//   ContentContainer,
//   EditorTemplate,
//   useMarkdownEditor,
// } from "@yukilabs/governance-components";
// import snapshot from "@snapshot-labs/snapshot.js";
// import { useWalletClient } from "wagmi";
// import { providers } from "ethers";
// import { Proposal } from "@snapshot-labs/snapshot.js/dist/sign/types";
// import { navigate } from "vite-plugin-ssr/client/router";
// import { useForm, Controller } from "react-hook-form";

// interface FieldValues {
//   // type: ProposalType;
//   // choices: string[];
//   title: string;
//   body: string;
//   discussion: string;
//   start: Date | null;
//   end: Date | null;
// }

// export function Page() {
//   const { data: walletClient } = useWalletClient();
//   const { editorValue, handleEditorChange } = useMarkdownEditor(
//     EditorTemplate.proposal
//   );

//   const {
//     handleSubmit,
//     control,
//     register,
//     formState: { isValid },
//   } = useForm<FieldValues>({
//     async defaultValues() {
//       return {
//         title: "",
//         body: "",
//         discussion: "",
//         start: new Date(),
//         end: new Date(new Date().getTime() + 3 * 60 * 60 * 24 * 1000),
//       };
//     },
//   });

//   const onSubmit = handleSubmit(async (data) => {
//     console.log(data);
//     try {
//       if (walletClient == null) return;

//       const client = new snapshot.Client712(import.meta.env.VITE_APP_SNAPSHOT_URL);

//       const web3 = new providers.Web3Provider(
//         walletClient.transport,
//         walletClient?.chain != null
//           ? {
//               chainId: walletClient.chain.id,
//               name: walletClient.chain.name,
//               ensAddress: walletClient.chain.contracts?.ensRegistry?.address,
//             }
//           : undefined
//       );

//       const block = await snapshot.utils.getBlockNumber(web3);

//       const params: Proposal = {
//         space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
//         type: "basic",
//         title: data.title,
//         body: editorValue,
//         choices: ["For", "Against", "Abstain"],
//         start: Math.floor(data.start!.getTime() / 1000),
//         end: Math.floor(data.end!.getTime() / 1000),
//         snapshot: block,
//         plugins: JSON.stringify({}),
//         discussion: data.discussion,
//       };

//       const receipt = (await client.proposal(
//         web3,
//         walletClient.account.address,
//         params
//       )) as any;

//       console.log(receipt);

//       navigate(`/voting-proposals/${receipt.id}`);
//     } catch (error) {
//       // Handle error
//       console.log(error);
//     }
//   });

//   return (
//     <>
//       <ContentContainer>
//         <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
//           <Heading variant="h3" mb="24px">
//             Create voting proposal
//           </Heading>
//           <form onSubmit={onSubmit}>
//             <Stack spacing="32px" direction={{ base: "column" }}>
//               <FormControl id="title">
//                 <FormLabel>Title</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="Briefly describe proposal"
//                   {...register("title", {
//                     required: true,
//                   })}
//                 />
//               </FormControl>
//               <FormControl id="delegate-statement">
//                 <FormLabel>Proposal Body</FormLabel>{" "}
//                 <Controller
//                   control={control}
//                   name="body"
//                   render={({ field: { onChange, value } }) => (
//                     <MarkdownEditor
//                       // maxLength={10000}
//                       onChange={handleEditorChange}
//                       value={editorValue}
//                     />
//                   )}
//                 />
//               </FormControl>
//               <FormControl id="starknet-type">
//                 <FormLabel>Forum discussion (optional) </FormLabel>

//                 <InputGroup maxW={{ md: "3xl" }}>
//                   <Input
//                     variant="primary"
//                     defaultValue="https://community.starknet.io/1234567890"
//                     {...register("discussion", {})}
//                   />
//                 </InputGroup>
//               </FormControl>

//               {/* // disabled for basic voting */}
//               <FormControl id="starknet-wallet-address">
//                 <FormLabel>Voting type</FormLabel>
//                 <Select
//                   placeholder="Select option"
//                   disabled
//                   defaultValue="option1"
//                 >
//                   <option value="option1">Basic</option>
//                 </Select>
//               </FormControl>
//               {/* // disabled for basic voting */}
//               <FormControl id="Choices">
//                 <FormLabel>Choices</FormLabel>
//                 <Stack spacing="12px" direction={{ base: "column" }}>
//                   <Box
//                     border="1px solid #E4E5E7 "
//                     padding="10px 15px"
//                     borderRadius="5px"
//                   >
//                     For
//                   </Box>
//                   <Box
//                     border="1px solid #E4E5E7 "
//                     padding="10px 15px"
//                     borderRadius="5px"
//                   >
//                     Against
//                   </Box>
//                   <Box
//                     border="1px solid #E4E5E7 "
//                     padding="10px 15px"
//                     borderRadius="5px"
//                   >
//                     Abstain
//                   </Box>
//                 </Stack>
//               </FormControl>
//               <FormControl id="starknet-wallet-address">
//                 <FormLabel>Voting period</FormLabel>
//                 <Stack spacing="12px" direction={{ base: "row" }}>
//                   <Box width="100%">
//                     <Controller
//                       control={control}
//                       name="start"
//                       render={({ field: { onChange, onBlur, value, ref } }) => (
//                         <DatePicker
//                           onChange={(value) => onChange(value)}
//                           onBlur={onBlur}
//                           selected={value}
//                           required
//                           showPopperArrow={true}
//                         />
//                       )}
//                     />
//                   </Box>
//                   <Box width="100%">
//                     <Controller
//                       control={control}
//                       name="end"
//                       render={({ field: { onChange, onBlur, value, ref } }) => (
//                         <DatePicker
//                           onChangeRaw={onChange}
//                           onChange={(value) => onChange(value)}
//                           onBlur={onBlur}
//                           selected={value}
//                           required
//                           showPopperArrow={true}
//                         />
//                       )}
//                     />
//                   </Box>
//                 </Stack>
//               </FormControl>
//               <Box display="flex" justifyContent="flex-end">
//                 <Button
//                   type="submit"
//                   size="sm"
//                   variant={"solid"}
//                   disabled={!isValid}
//                 >
//                   Create voting proposal
//                 </Button>
//               </Box>
//             </Stack>
//           </form>
//         </Box>
//       </ContentContainer>
//     </>
//   );
// }

// export const documentProps = {
//   title: "Vote / Create",
// } satisfies DocumentProps;
