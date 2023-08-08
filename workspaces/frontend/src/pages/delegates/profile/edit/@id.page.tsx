import { DocumentProps } from "src/renderer/types";
import { useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  ContentContainer,
  Checkbox,
  Multiselect,
  useMarkdownEditor,
  MarkdownEditor,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { delegateTypeEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";

const delegateTypeValues = delegateTypeEnum.enumValues;

export function Page() {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<RouterInput["delegates"]["editDelegate"]>();

  const formErrors = errors as FieldErrors<
    RouterInput["delegates"]["editDelegate"]
  >;

  const editDelegate = trpc.delegates.editDelegate.useMutation();
  const pageContext = usePageContext();
  const { data: delegate, isSuccess } = trpc.delegates.getDelegateById.useQuery(
    {
      id: pageContext.routeParams!.id,
    },
  );

  const { editorValue, handleEditorChange, convertMarkdownToSlate, editor } =
    useMarkdownEditor("");

  const processData = async () => {
    const delegateData = delegate as {
      delegateStatement?: string;
      delegateType: string;
      starknetWalletAddress: string;
      twitter: string;
      discord: string;
      discourse: string;
      agreeTerms: boolean;
      understandRole: boolean;
    };

    editor.insertNodes(
      await convertMarkdownToSlate(delegateData.delegateStatement || ""),
    );
    setValue("delegateType", delegateData.delegateType);
    setValue("starknetWalletAddress", delegateData.starknetWalletAddress);
    setValue("twitter", delegateData.twitter);
    setValue("discord", delegateData.discord);
    setValue("discourse", delegateData.discourse);
    setValue("agreeTerms", delegateData.agreeTerms);
    setValue("understandRole", delegateData.understandRole);
  };

  useEffect(() => {
    if (delegate && isSuccess) processData();
  }, [isSuccess]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.delegateStatement = editorValue;
      data.id = pageContext.routeParams!.id;
      await editDelegate.mutateAsync(data).then(() => {
        navigate(`/delegates/profile/${pageContext.routeParams!.id}`);
      });
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
            Edit post
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Delegate pitch</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  customEditor={editor}
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
                {formErrors.delegateType && (
                  <span>This field is required.</span>
                )}
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
                      isChecked={field.value ?? false}
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
                      isChecked={field.value ?? false}
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

              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  color="#D83E2C"
                  type="submit"
                  size="sm"
                  variant={"outline"}
                  mr="auto"
                >
                  Delete
                </Button>
                <Button
                  as="a"
                  size="sm"
                  variant={"ghost"}
                  href={`/delegates/profile/${pageContext.routeParams!.id}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Save
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
  title: "Delegate / Edit",
} satisfies DocumentProps;
