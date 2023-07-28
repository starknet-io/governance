import { DocumentProps } from "src/renderer/types";
import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Flex,
  ContentContainer,
  QuillEditor,
  EditorTemplate,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["snips"]["createSNIP"]>();
  const [editorValue, setEditorValue] = useState<string>(EditorTemplate.snip);
  const createSNIP = trpc.snips.createSNIP.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.description = editorValue;
      await createSNIP.mutateAsync(data);
      navigate("/snips");
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
            Create SNIP Proposal
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Title</FormLabel>
                <Input
                  variant="primary"
                  placeholder="SNIP title"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Proposal Body</FormLabel>
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.description && <span>This field is required.</span>}
                {/* <Textarea
                  variant="primary"
                  placeholder="Enter your delegate statement here..."
                  {...register("description", {
                    required: true,
                  })}
                />
                {errors.description && <span>This field is required.</span>} */}
              </FormControl>
              <FormControl id="delegate-statement">
                <FormLabel>Forum discussion(optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="http://community.starknet.io/1234567890"
                  {...register("discussionURL")}
                />
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Select option"
                  {...register("status", { required: true })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Last Call">Last call</option>
                </Select>
                {errors.status && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Create SNIP
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Snip / Create",
} satisfies DocumentProps;

// import { DocumentProps } from "src/renderer/types";
// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Heading,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Select,
//   Flex,
//   ContentContainer,
//   MarkdownEditor,
//   EditorTemplate,
//   useMarkdownEditor,
// } from "@yukilabs/governance-components";
// import { trpc } from "src/utils/trpc";
// import { useForm } from "react-hook-form";
// import { RouterInput } from "@yukilabs/governance-backend/src/routers";
// import { navigate } from "vite-plugin-ssr/client/router";
// const initialValue = [
//   {
//     type: "paragraph",
//     children: [
//       { text: "This is sdfgdsfgeditable " },
//       { text: "rich", bold: true },
//       { text: " text, " },
//       { text: "much", italic: true },
//       { text: " better than a " },
//       { text: "<textarea>", code: true },
//       { text: "!" },
//     ],
//   },
//   {
//     type: "paragraph",
//     children: [
//       {
//         text: "Since it's rich text, you can do things like turn a selection of text ",
//       },
//       { text: "bold", bold: true },
//       {
//         text: ", or add a semantically rendered block quote in the middle of the page, like this:",
//       },
//     ],
//   },
//   {
//     type: "block-quote",
//     children: [{ text: "A wise quote." }],
//   },
//   {
//     type: "paragraph",
//     align: "center",
//     children: [{ text: "Try it out for yourself!" }],
//   },
// ];

// export function Page() {
//   const { editorValue, handleEditorChange } = useMarkdownEditor(initialValue);
//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isValid },
//   } = useForm<RouterInput["snips"]["createSNIP"]>();

//   const createSNIP = trpc.snips.createSNIP.useMutation();

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       data.description = editorValue;
//       await createSNIP.mutateAsync(data);
//       navigate("/snips");
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
//             Create SNIP Proposal
//           </Heading>
//           <form onSubmit={onSubmit}>
//             <Stack spacing="32px" direction={{ base: "column" }}>
//               <FormControl id="delegate-statement">
//                 <FormLabel>Title</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="SNIP title"
//                   {...register("title", {
//                     required: true,
//                   })}
//                 />
//                 {errors.title && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="proposal-body">
//                 <FormLabel>Proposal Body</FormLabel>
//                 <MarkdownEditor
//                   onChange={handleEditorChange}
//                   value={editorValue}
//                 />
//                 {errors.description && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="delegate-statement">
//                 <FormLabel>Forum discussion(optional)</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="http://community.starknet.io/1234567890"
//                   {...register("discussionURL")}
//                 />
//               </FormControl>
//               <FormControl id="starknet-type">
//                 <FormLabel>Status</FormLabel>
//                 <Select placeholder="Select option">
//                   <option value="option1">Draft</option>
//                   <option value="option2">Review</option>
//                   <option value="option3">Last call</option>
//                 </Select>
//               </FormControl>

//               <Flex justifyContent="flex-end">
//                 <Button
//                   type="submit"
//                   size="sm"
//                   variant={"solid"}
//                   disabled={!isValid}
//                 >
//                   Create SNIP
//                 </Button>
//               </Flex>
//             </Stack>
//           </form>
//         </Box>
//       </ContentContainer>
//     </>
//   );
// }

// export const documentProps = {
//   title: "Snip / Create",
// } satisfies DocumentProps;
