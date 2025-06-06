import React, { useEffect, useRef, useState } from "react";
import {
  Banner,
  Box,
  Button,
  Checkbox,
  DeletionDialog,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  MarkdownEditor,
  Stack,
  Text,
  useDisclosure,
  useMarkdownEditor,
  FormControlled,
  Multiselect,
  useFormErrorHandler,
  RadioGroup,
  Radio,
  ArrowRightIcon,
  AgreementModal,
} from "@yukilabs/governance-components";
import type { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { Controller, useForm } from "react-hook-form";
import { delegateNames } from "../Delegates";
import { useFileUpload } from "../../hooks/useFileUpload";
import { interestsEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { trpc } from "../../utils/trpc";
import { usePageContext } from "../../renderer/PageContextProvider";
import { navigate } from "vite-plugin-ssr/client/router";
import { Spinner } from "@chakra-ui/react";
import { delegationAgreement } from "../../utils/data";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";
import { useCheckBalance } from "../useCheckBalance";
import { WalletButtons } from "../../pages/profile/settings/index.page";
import { useWallets } from "../../hooks/useWallets";

interface DelegateFormProps {
  mode: "create" | "edit";
  id?: string; // Only required in edit mode
  delegate?: Delegate;
  isFetchingDelegateSuccess?: boolean;
  isOnboarding?: boolean;
}

type FormValues = {
  id?: string;
  statement: string;
  interests: string[];
  confirmDelegateAgreement: boolean;
  customDelegateAgreementContent?: string;
  understandRole: boolean;
};

const interestsValues = interestsEnum.enumValues;

export const DelegateForm: React.FC<DelegateFormProps> = ({
  mode,
  delegate,
  isFetchingDelegateSuccess,
  isOnboarding,
}) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isValid },
    trigger,
    clearErrors,
    setError,
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    shouldFocusError: false,
  });
  const confirmDelegateAgreement = watch("confirmDelegateAgreement");
  const customDelegateAgreementContent = watch(
    "customDelegateAgreementContent",
  );
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = useRef(null);

  const { editorValue, handleEditorChange, convertMarkdownToSlate, editor } =
    useMarkdownEditor("");
  const [error, setErrorField] = useState("");
  const {
    isOpen: isDelegateAgreementOpen,
    onOpen: onDelegateAgreementOpen,
    onClose: onDelegateAgreementClose,
  } = useDisclosure();
  const {
    editorValue: editorCustomAgreementValue,
    handleEditorChange: handleCustomAgreement,
    convertMarkdownToSlate: editorCustomAgreementConvertMarkdownToSlate,
    editor: editorCustomAgreement,
  } = useMarkdownEditor("");

  const handleEditorChangeWrapper = (value) => {
    handleEditorChange(value);
    if (errors.statement) {
      trigger("statement");
    }
  };

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
    setTimeout(() => {
      trigger(); // to validate after editor is loaded
    }, 10);
  };

  const { starknetWallet, ethWallet } = useWallets();
  const { checkUserBalance } = useCheckBalance({
    ethAddress: ethWallet?.address,
    starknetAddress: starknetWallet?.address,
  });

  useEffect(() => {
    if (mode === "create") {
      checkUserBalance({
        onFail: () => {
          navigate("/delegates");
        },
      });
    }
  }, [ethWallet?.address, mode]);

  useEffect(() => {
    if (mode === "edit" && isFetchingDelegateSuccess) {
      processData();
    }
    if (mode === "create") {
      // Any initialization specific to create mode
    }
  }, [isFetchingDelegateSuccess, mode]);

  const { handleUpload } = useFileUpload();

  const [showCustomAgreementEditor, setShowCustomAgreementEditor] =
    useState(false);
  const [agreementType, setAgreementType] = useState<
    "standard" | "custom" | ""
  >("");

  const createDelegate = trpc.delegates.saveDelegate.useMutation();
  const editDelegate = trpc.delegates.editDelegate.useMutation();
  const deleteDelegate = trpc.delegates.deleteDelegate.useMutation();

  const pageContext = usePageContext();
  const { setErrorRef, scrollToError } = useFormErrorHandler([
    "statement",
    "interests",
  ]);

  const onSubmitHandler = async (data) => {
    try {
      setErrorField("");

      if (!starknetWallet?.id) {
        setErrorField("Connect Starknet wallet in order to become delegate");
        return;
      }
      if (!ethWallet?.id) {
        setErrorField("Connect Ethereum wallet in order to become delegate");
        return;
      }
      data.statement = editorValue;
      // checking if onboarding is true and setting isKarmaDelegate to false and isGovernanceDelegate to true
      if (isOnboarding) {
        data.isKarmaDelegate = false;
        data.isGovernanceDelegate = true;
      }

      if (mode === "edit") {
        data.id = pageContext.routeParams!.id;
      }
      if (showCustomAgreementEditor || agreementType === "custom") {
        data.customDelegateAgreementContent = editorCustomAgreementValue;
      } else {
        delete data.customDelegateAgreementContent;
      }

      const mutation = mode === "create" ? createDelegate : editDelegate;
      await mutation
        .mutateAsync(data)
        .then((res) => {
          window.location.href = `/delegates/profile/${res.id}`;
          setErrorField("");
        })
        .catch((err) => {
          setErrorField(err?.message ? err.message : JSON.stringify(err));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onErrorSubmit = (errors) => {
    if (Object.keys(errors).length > 0) {
      scrollToError(errors);
    }
  };

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

  const isSubmitting = createDelegate.isLoading || editDelegate.isLoading;

  const handleRadioChange = (value: string) => {
    if (value === "standard") {
      setAgreementType("standard");
      setShowCustomAgreementEditor(false);
      setValue("confirmDelegateAgreement", true);
    } else if (value === "custom") {
      setAgreementType("custom");
      setShowCustomAgreementEditor(true);
      setValue("confirmDelegateAgreement", false);
    } else {
      setAgreementType("");
      setShowCustomAgreementEditor(false);
      setValue("confirmDelegateAgreement", false);
    }
  };

  const { isMobile } = useIsMobile();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorSubmit)} noValidate>
        <DeletionDialog
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          onDelete={onDelete}
          cancelRef={cancelRef}
          entityName="Delegate"
        />
        <Stack spacing="standard.xl" direction={{ base: "column" }}>
          <FormControlled
            name="statement"
            isRequired
            id="statement"
            label="Delegate pitch"
            isInvalid={!!errors.statement}
            errorMessage={errors.statement?.message}
            ref={(ref) => setErrorRef("statement", ref)}
          >
            <Controller
              name="statement"
              control={control}
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
                  isInvalid={!!errors.statement}
                  onChange={handleEditorChangeWrapper}
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
          </FormControlled>
          <FormControlled
            name="interests"
            ref={(ref) => setErrorRef("interests", ref)}
            id="starknet-type"
            isRequired
            label="Delegate interests"
            isInvalid={!!errors.interests}
            errorMessage={errors.interests?.message || "Choose your interests"}
          >
            <Controller
              name="interests"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Multiselect
                  size="md"
                  isInvalid={!!errors.interests}
                  options={interestsValues.map((option) => ({
                    value: option,
                    label: delegateNames?.[option] ?? option,
                  }))}
                  value={field.value as any}
                  onChange={(values) => field.onChange(values)}
                  labels={delegateNames} // Pass delegateNames as labels
                />
              )}
            />
          </FormControlled>
          <WalletButtons withLabel />
          <Divider />
          <Box>
            <Heading variant="h3" display="flex" mb="standard.base">
              Delegate agreement
            </Heading>
            <Text
              variant="medium"
              color="content.default.default"
              my="standard.base"
            >
              Add an agreement between you and the people who delegate to you.
            </Text>
          </Box>
          {/* <Heading variant="h1">I don't need a delegate agreement</Heading> */}
          {/* <FormControl id="confirmDelegateAgreement">
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
            I agree with the Starknet foundation suggested delegate agreement
            View.
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
        </FormControl> */}

          <Box>
            <RadioGroup
              value={agreementType}
              onChange={(value) => handleRadioChange(value)}
            >
              <Stack spacing={"12px"} direction="column">
                <FormControl id="defaultDelegateAgreement">
                  <Radio
                    value=""
                    isChecked={
                      !confirmDelegateAgreement && !editorCustomAgreementValue
                    }
                    onChange={() => {
                      setShowCustomAgreementEditor(false);
                      setValue("confirmDelegateAgreement", false);
                      setValue("customDelegateAgreementContent", "");
                      handleCustomAgreement([{ children: [{ text: "" }] }]);
                    }}
                  >
                    I don&apos;t need a delegate agreement.
                  </Radio>
                </FormControl>
                <FormControl id="confirmDelegateAgreement">
                  <Radio
                    value="standard"
                    isChecked={confirmDelegateAgreement}
                    onChange={() => {
                      setShowCustomAgreementEditor(false);
                      setValue("confirmDelegateAgreement", true);
                      setValue("customDelegateAgreementContent", "");
                    }}
                  >
                    <Flex gap={1}>
                      <Text
                        variant="mediumStrong"
                        color="content.accent.default"
                      >
                        I agree with the Starknet Foundation&apos;s suggested
                        delegate agreement
                      </Text>
                      <Button
                        top="-1px"
                        left="-6px"
                        variant="textSmall"
                        onClick={onDelegateAgreementOpen}
                      >
                        View
                      </Button>
                    </Flex>
                  </Radio>
                </FormControl>
                <FormControl id="customDelegateAgreement">
                  <Radio
                    value="custom"
                    isChecked={
                      !confirmDelegateAgreement && editorCustomAgreementValue
                    }
                    onChange={() => {
                      setShowCustomAgreementEditor(true);
                      setValue("confirmDelegateAgreement", false);
                    }}
                  >
                    I want to provide a custom delegate agreement.
                  </Radio>
                </FormControl>
              </Stack>
            </RadioGroup>
          </Box>

          {/* For some reason, markdown editor as breaking if I make it conditional render, so using display block/hidden */}
          <div
            style={{
              display: agreementType === "custom" ? "block" : "none",
            }}
          >
            <FormControlled
              name="customDelegateAgreementContent"
              id="custom-agreement-editor"
              label="Custom Delegate Agreement"
              isRequired
            >
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
            </FormControlled>
          </div>
          <FormControl id="understandRole" display="none">
            <Controller
              control={control}
              name="understandRole"
              defaultValue={false}
              rules={{ required: false }}
              render={({ field }) => (
                <Checkbox
                  isChecked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  I understand the role of StarkNet delegates, we encourage all
                  to read the Delegate Expectations 328; Starknet Governance
                  announcements Part 1 98, Part 2 44, and Part 3 34; The
                  Foundation Post 60; as well as the Delegate Onboarding
                  announcement 539 before proceeding.
                </Checkbox>
              )}
            />
            {errors.understandRole && <span>This field is required.</span>}
          </FormControl>
          {mode === "edit" && isOnboarding ? (
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                size="standard"
                variant="primary"
                rightIcon={<ArrowRightIcon />}
              >
                Continue
              </Button>
            </Flex>
          ) : mode === "edit" ? (
            <Flex
              justifyContent="flex-end"
              gap="16px"
              sx={{
                "@media (max-width: 768px)": {
                  gap: "0px",
                  flexDirection: "column",
                },
              }}
            >
              <Button
                size="condensed"
                variant="danger"
                onClick={onOpenDelete}
                mr="auto"
                sx={{
                  "@media (max-width: 768px)": {
                    order: 3,
                    width: "100%",
                    marginRight: "0",
                  },
                }}
              >
                Delete
              </Button>
              <Button
                as="a"
                size="condensed"
                variant="ghost"
                href={`/delegates/profile/${pageContext.routeParams!.id}`}
                sx={{
                  "@media (max-width: 768px)": {
                    marginBottom: "standard.lg",
                    width: "100%",
                    order: 2,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="condensed"
                variant="primary"
                sx={{
                  "@media (max-width: 768px)": {
                    marginBottom: "standard.sm",
                    order: 1,
                    width: "100%",
                  },
                }}
              >
                <Flex alignItems="center" gap={2}>
                  {isSubmitting && <Spinner size="sm" />}
                  <div>Save</div>
                </Flex>
              </Button>
            </Flex>
          ) : (
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                width={{ base: "100%", md: "auto" }}
                size="standard"
              >
                <Flex alignItems="center" gap={2}>
                  {isSubmitting && <Spinner size="sm" />}
                  <div>Create Delegate</div>
                </Flex>
              </Button>
            </Flex>
          )}

          {error.length ? (
            <Banner label={error} variant="error" type="error" />
          ) : null}
        </Stack>
      </form>
      <AgreementModal
        isOpen={isDelegateAgreementOpen}
        onClose={onDelegateAgreementClose}
        content={delegationAgreement}
      />
    </>
  );
};

export default DelegateForm;
