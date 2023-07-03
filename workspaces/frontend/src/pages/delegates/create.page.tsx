import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  ContentContainer,
  Flex,
  Box,
  QuillEditor,
  EditorTemplate,
  Multiselect,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { delegateTypeEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { DocumentProps } from "src/renderer/types";
import { useState } from "react";

const delegateTypeValues = delegateTypeEnum.enumValues;

type FormValues = {
  delegateStatement: string;
  delegateType: string[];
  starknetWalletAddress: string;
  twitter: string;
  discord: string;
  discourse: string;
  agreeTerms: boolean;
  understandRole: boolean;
};

export function Page() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>();
  const [editorValue, setEditorValue] = useState<string>(
    EditorTemplate.delegate
  );
  const createDelegate = trpc.delegates.saveDelegate.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.delegateStatement = editorValue;
      await createDelegate
        .mutateAsync(data)
        .then((res) => {
          window.location.href = `/delegates/profile/${res.id}`;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <Box maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create delegate profile
          </Heading>

          <form onSubmit={onSubmit}>
            <Stack spacing="24px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Delegate pitch</FormLabel>
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.delegateStatement && (
                  <span>This field is required.</span>
                )}
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Delegate type</FormLabel>
                <Controller
                  name="delegateType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Multiselect
                      options={delegateTypeValues.map((option) => ({
                        value: option,
                        label: option,
                      }))}
                      value={field.value as any}
                      onChange={(values) => field.onChange(values)}
                    />
                  )}
                />
                {errors.delegateType && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="starknet-wallet-address">
                <FormLabel>Starknet wallet address</FormLabel>
                <Input
                  variant="primary"
                  placeholder="0x..."
                  {...register("starknetWalletAddress", {
                    required: true,
                  })}
                />
                {errors.starknetWalletAddress && (
                  <span>This field is required.</span>
                )}
              </FormControl>
              <FormControl id="twitter">
                <FormLabel>Twitter</FormLabel>
                <Input
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("twitter")}
                />
                {errors.twitter && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="discord">
                <FormLabel>Discord</FormLabel>
                <Input
                  variant="primary"
                  placeholder="name#1234"
                  {...register("discord")}
                />
                {errors.discord && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="discourse">
                <FormLabel>Discourse</FormLabel>
                <Input
                  variant="primary"
                  placeholder="yourusername"
                  {...register("discourse")}
                />
                {errors.discourse && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="agreeTerms">
                <Controller
                  control={control}
                  name="agreeTerms"
                  defaultValue={false}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Checkbox
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      Agree with delegate terms
                    </Checkbox>
                  )}
                />
                {errors.agreeTerms && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="understandRole">
                <Controller
                  control={control}
                  name="understandRole"
                  defaultValue={false}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Checkbox
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      I understand the role of StarkNet delegates, we encourage
                      all to read the Delegate Expectations 328; Starknet
                      Governance announcements Part 1 98, Part 2 44, and Part 3
                      34; The Foundation Post 60; as well as the Delegate
                      Onboarding announcement 539 before proceeding.
                    </Checkbox>
                  )}
                />
                {errors.understandRole && <span>This field is required.</span>}
              </FormControl>
              <Flex justifyContent="flex-end">
                <Button type="submit" variant="solid" disabled={!isValid}>
                  Submit delegate profile
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
  title: "Delegates / Create",
} satisfies DocumentProps;

// import { Controller, useForm } from "react-hook-form";
// import {
//   Button,
//   Heading,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Checkbox,
//   ContentContainer,
//   Flex,
//   Box,
//   MarkdownEditor,
//   EditorTemplate,
//   Multiselect,
//   useMarkdownEditor,
// } from "@yukilabs/governance-components";
// import { trpc } from "src/utils/trpc";
// import { delegateTypeEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
// import { DocumentProps } from "src/renderer/types";
// import { useState } from "react";

// const delegateTypeValues = delegateTypeEnum.enumValues;

// type FormValues = {
//   delegateStatement: string;
//   delegateType: string[];
//   starknetWalletAddress: string;
//   twitter: string;
//   discord: string;
//   discourse: string;
//   agreeTerms: boolean;
//   understandRole: boolean;
// };

// export function Page() {
//    const { editorValue, handleEditorChange  } = useMarkdownEditor('dsfgsdfg');

//   const {
//     handleSubmit,
//     register,
//     control,
//     formState: { errors, isValid },
//   } = useForm<FormValues>();
//   // const [editorValue, setEditorValue] = useState<string>(
//   //   EditorTemplate.delegate
//   // );
//   const createDelegate = trpc.delegates.saveDelegate.useMutation();

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       data.delegateStatement = editorValue;
//       await createDelegate
//         .mutateAsync(data)
//         .then((res) => {
//           window.location.href = `/delegates/profile/${res.id}`;
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } catch (error) {
//       // Handle error
//       console.log(error);
//     }
//   });

//   return (
//     <>
//       <ContentContainer>
//         <Box maxWidth="538px" pb="200px" mx="auto">
//           <Heading variant="h3" mb="24px">
//             Create delegate profile
//           </Heading>

//           <form onSubmit={onSubmit}>
//             <Stack spacing="24px" direction={{ base: "column" }}>
//               <FormControl id="delegate-statement">
//                 <FormLabel>Delegate pitch</FormLabel>
//                   <MarkdownEditor
//                   onChange={handleEditorChange}
//                    value={editorValue}

//                 />
//                 {errors.delegateStatement && (
//                   <span>This field is required.</span>
//                 )}
//               </FormControl>
//               <FormControl id="starknet-type">
//                 <FormLabel>Delegate type</FormLabel>
//                 <Controller
//                   name="delegateType"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Multiselect
//                       options={delegateTypeValues.map((option) => ({
//                         value: option,
//                         label: option,
//                       }))}
//                       value={field.value as any}
//                       onChange={(values) => field.onChange(values)}
//                     />
//                   )}
//                 />
//                 {errors.delegateType && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="starknet-wallet-address">
//                 <FormLabel>Starknet wallet address</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="0x..."
//                   {...register("starknetWalletAddress", {
//                     required: true,
//                   })}
//                 />
//                 {errors.starknetWalletAddress && (
//                   <span>This field is required.</span>
//                 )}
//               </FormControl>
//               <FormControl id="twitter">
//                 <FormLabel>Twitter</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="@yourhandle"
//                   {...register("twitter")}
//                 />
//                 {errors.twitter && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="discord">
//                 <FormLabel>Discord</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="name#1234"
//                   {...register("discord")}
//                 />
//                 {errors.discord && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="discourse">
//                 <FormLabel>Discourse</FormLabel>
//                 <Input
//                   variant="primary"
//                   placeholder="yourusername"
//                   {...register("discourse")}
//                 />
//                 {errors.discourse && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="agreeTerms">
//                 <Controller
//                   control={control}
//                   name="agreeTerms"
//                   defaultValue={false}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Checkbox
//                       isChecked={field.value}
//                       onChange={(e) => field.onChange(e.target.checked)}
//                     >
//                       Agree with delegate terms
//                     </Checkbox>
//                   )}
//                 />
//                 {errors.agreeTerms && <span>This field is required.</span>}
//               </FormControl>
//               <FormControl id="understandRole">
//                 <Controller
//                   control={control}
//                   name="understandRole"
//                   defaultValue={false}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <Checkbox
//                       isChecked={field.value}
//                       onChange={(e) => field.onChange(e.target.checked)}
//                     >
//                       I understand the role of StarkNet delegates, we encourage
//                       all to read the Delegate Expectations 328; Starknet
//                       Governance announcements Part 1 98, Part 2 44, and Part 3
//                       34; The Foundation Post 60; as well as the Delegate
//                       Onboarding announcement 539 before proceeding.
//                     </Checkbox>
//                   )}
//                 />
//                 {errors.understandRole && <span>This field is required.</span>}
//               </FormControl>
//               <Flex justifyContent="flex-end">
//                 <Button type="submit" variant="solid" disabled={!isValid}>
//                   Submit delegate profile
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
//   title: "Delegates / Create",
// } satisfies DocumentProps;
