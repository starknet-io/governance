import { DocumentProps } from "src/renderer/types";
import { useEffect, useState } from "react";
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

  const [showCustomAgreementEditor, setShowCustomAgreementEditor] =
    useState(false);
  const [agreementType, setAgreementType] = useState<
    "standard" | "custom" | null
  >(null);
  const editDelegate = trpc.delegates.editDelegate.useMutation();
  const pageContext = usePageContext();
  const { data: delegate, isSuccess } = trpc.delegates.getDelegateById.useQuery(
    {
      id: pageContext.routeParams!.id,
    },
  );

  const { editorValue, handleEditorChange, convertMarkdownToSlate, editor } =
    useMarkdownEditor("");

  const {
    editorValue: editorCustomAgreementValue,
    handleEditorChange: handleCustomAgreement,
    convertMarkdownToSlate: editorCustomAgreementConvertMarkdownToSlate,
    editor: editorCustomAgreement,
  } = useMarkdownEditor("");

  const processData = async () => {
    const delegateData = delegate;
    if (!delegateData) return;

    editor.insertNodes(
      await convertMarkdownToSlate(delegateData.delegateStatement || ""),
    );
    editorCustomAgreement.insertNodes(
      await editorCustomAgreementConvertMarkdownToSlate(
        delegateData?.customAgreement?.content || "",
      ),
    );
    setValue("delegateType", delegateData.delegateType as string[]);
    setValue("starknetAddress", delegateData?.author?.starknetAddress ?? "");
    setValue("twitter", delegateData.twitter as string);
    setValue("discord", delegateData.discord as string);
    setValue("discourse", delegateData.discourse as string);
    setValue("understandRole", delegateData.understandRole as boolean);
    setValue(
      "confirmDelegateAgreement",
      delegateData.confirmDelegateAgreement as boolean,
    );
    if (delegate?.confirmDelegateAgreement) {
      setAgreementType("standard");
    } else if (delegate?.customAgreement) {
      setAgreementType("custom");
    } else {
      setAgreementType(null);
    }
  };

  const deleteDelegate = trpc.delegates.deleteDelegate.useMutation();

  useEffect(() => {
    if (delegate && isSuccess) processData();
  }, [isSuccess]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.delegateStatement = editorValue;
      data.id = pageContext.routeParams!.id;
      if (showCustomAgreementEditor || agreementType === "custom") {
        data.customDelegateAgreementContent = editorCustomAgreementValue;
      }
      await editDelegate.mutateAsync(data).then(() => {
        navigate(`/delegates/profile/${pageContext.routeParams!.id}`);
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  const onDelete = async () => {
    if (!delegate?.id) return;

    try {
      await deleteDelegate.mutateAsync({ id: delegate.id });
      navigate("/delegates");
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

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
                  {...register("starknetAddress", {
                    required: true,
                  })}
                />
                {errors.starknetAddress && <span>This field is required.</span>}
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
              <FormControl id="confirmDelegateAgreement">
                <Checkbox
                  isChecked={agreementType === "standard"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAgreementType("standard");
                      setShowCustomAgreementEditor(false);
                      setValue("confirmDelegateAgreement", true);
                    } else {
                      setAgreementType(null);
                      setValue("confirmDelegateAgreement", false);
                    }
                  }}
                >
                  I agree with the Starknet foundation suggested delegate
                  agreement View.
                </Checkbox>
                {errors.confirmDelegateAgreement && (
                  <span>This field is required.</span>
                )}
              </FormControl>
              <FormControl id="customDelegateAgreement">
                <Checkbox
                  isChecked={agreementType === "custom"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAgreementType("custom");
                      setShowCustomAgreementEditor(true);
                      setValue("confirmDelegateAgreement", false);
                    } else {
                      setAgreementType(null);
                      setShowCustomAgreementEditor(false);
                    }
                  }}
                >
                  I want to provide a custom delegate agreement.
                </Checkbox>
              </FormControl>
              {/* For some reason, markdown editor as breaking if I make it conditional render, so using display block/hidden */}
              <div
                style={{
                  display: agreementType === "custom" ? "block" : "none",
                }}
              >
                <FormControl id="custom-agreement-editor">
                  <FormLabel>Custom Delegate Agreement</FormLabel>
                  <MarkdownEditor
                    onChange={handleCustomAgreement}
                    value={editorCustomAgreementValue}
                    customEditor={
                      delegate?.customAgreement
                        ? editorCustomAgreement
                        : undefined
                    }
                  />
                </FormControl>
              </div>
              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  color="#D83E2C"
                  size="sm"
                  onClick={onDelete}
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
