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
  Banner,
  Text,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useFileUpload } from "src/hooks/useFileUpload";
import { interestsEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { validateStarknetAddress } from "src/utils/helpers";

const interestsValues = interestsEnum.enumValues;

export function Page() {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isValid },
    setError,
    trigger,
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
  const [error, setErrors] = useState("");

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
      await convertMarkdownToSlate(delegateData.statement || ""),
    );
    editorCustomAgreement.insertNodes(
      await editorCustomAgreementConvertMarkdownToSlate(
        delegateData?.customAgreement?.content || "",
      ),
    );
    setValue("interests", delegateData.interests as string[]);
    setValue("starknetAddress", delegateData?.author?.starknetAddress ?? "");
    setValue("twitter", delegateData.twitter as string);
    setValue("telegram", delegateData.telegram as string);
    setValue("discord", delegateData.discord as string);
    setValue("discourse", delegateData.discourse as string);
    setValue("understandRole", delegateData.understandRole as boolean);
    setValue(
      "confirmDelegateAgreement",
      delegateData.confirmDelegateAgreement as boolean,
    );
    if (!validateStarknetAddress(delegateData?.author?.starknetAddress)) {
      setError("starknetAddress", {
        type: "manual",
        message: "Invalid Starknet address.",
      });
    }
    if (delegate?.confirmDelegateAgreement) {
      setAgreementType("standard");
    } else if (delegate?.customAgreement) {
      setAgreementType("custom");
    } else {
      setAgreementType(null);
    }
    setTimeout(() => {
      trigger(); // to validate after editor is loaded
    }, 10);
  };

  const deleteDelegate = trpc.delegates.deleteDelegate.useMutation();
  const { handleUpload } = useFileUpload();
  useEffect(() => {
    if (delegate && isSuccess) {
      processData();
    }
  }, [isSuccess]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = editorValue;
      data.id = pageContext.routeParams!.id;
      if (showCustomAgreementEditor || agreementType === "custom") {
        data.customDelegateAgreementContent = editorCustomAgreementValue;
      }
      await editDelegate
        .mutateAsync(data)
        .then(() => {
          navigate(`/delegates/profile/${pageContext.routeParams!.id}`);
        })
        .catch((err) => {
          console.log(err);
          setErrors(err?.message ? err.message : JSON.stringify(err));
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
            Edit Delegate
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Delegate pitch</FormLabel>
                <Controller
                  name="statement"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: {
                      required: (value) => {
                        // Trim the editorValue to remove spaces and new lines
                        const trimmedValue = editorValue?.trim();

                        if (!trimmedValue?.length || !trimmedValue) {
                          return "Describe why a community member should delegate to you";
                        }
                      },
                    },
                  }}
                  render={({ field }) => (
                    <MarkdownEditor
                      onChange={(value) => {
                        handleEditorChange(value);
                        field.onChange(value); // Update the form state
                        trigger("statement");
                      }}
                      value={editorValue}
                      customEditor={editor}
                      handleUpload={handleUpload}
                      offsetPlaceholder={"-8px"}
                      placeholder={`
Overview
Core values
Why me?
Conflicts of interest
                      `}
                    />
                  )}
                />
                {errors.statement && <span>{errors.statement.message}</span>}
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Delegate interests</FormLabel>
                <Controller
                  name="interests"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Multiselect
                      options={interestsValues.map((option) => ({
                        value: option,
                        label: option,
                      }))}
                      value={field.value as any}
                      onChange={(values) => field.onChange(values)}
                    />
                  )}
                />
                {errors.interests && <span>Choose your interests</span>}
              </FormControl>
              <FormControl id="starknet-wallet-address">
                <FormLabel>Starknet wallet address</FormLabel>
                <Input
                  variant="primary"
                  placeholder="0x..."
                  {...register("starknetAddress", {
                    required: true,
                    validate: (value) =>
                      validateStarknetAddress(value) ||
                      "Invalid Starknet address",
                  })}
                />
                {errors.starknetAddress && (
                  <span>
                    {errors.starknetAddress.message ||
                      "This field is required."}
                  </span>
                )}
              </FormControl>
              <FormControl id="twitter">
                <FormLabel>Twitter (optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("twitter")}
                />
              </FormControl>
              <FormControl id="telegram">
                <FormLabel>Telegram (optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("telegram")}
                />
              </FormControl>
              <FormControl id="discord">
                <FormLabel>Discord (optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="name#1234"
                  {...register("discord")}
                />
              </FormControl>
              <FormControl id="discourse">
                <FormLabel>Discourse (optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="yourusername"
                  {...register("discourse")}
                />
              </FormControl>
              <Box>
                <Heading
                  variant="h3"
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                >
                  Delegate agreement{" "}
                  <Text variant="largeStrong">(optional)</Text>
                </Heading>
                <Text variant="medium">Briefly explain what this means.</Text>
              </Box>
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
                  <Controller
                    name="customDelegateAgreementContent"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <MarkdownEditor
                        onChange={(value) => {
                          handleCustomAgreement(value);
                          field.onChange(value); // Update the form state
                        }}
                        value={editorCustomAgreementValue}
                        customEditor={
                          delegate?.customAgreement
                            ? editorCustomAgreement
                            : undefined
                        }
                        handleUpload={handleUpload}
                      />
                    )}
                  />
                </FormControl>
              </div>
              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  type="submit"
                  size="condensed"
                  variant="danger"
                  onClick={onDelete}
                  mr="auto"
                >
                  Delete
                </Button>
                <Button
                  as="a"
                  size="condensed"
                  variant="ghost"
                  href={`/delegates/profile/${pageContext.routeParams!.id}`}
                >
                  Cancel
                </Button>
                <Button type="submit" size="condensed" variant="primary">
                  Save
                </Button>
              </Flex>
              {error.length ? (
                <Banner label={error} variant="error" type="error" />
              ) : null}
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
