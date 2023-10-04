import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Heading,
  Input,
  Stack,
  ContentContainer,
  Flex,
  Box,
  Multiselect,
  useMarkdownEditor,
  MarkdownEditor,
  Text,
  Divider,
  Banner,
  FormControlled,
  RadioGroup,
  Radio,
  FormControl,
  Checkbox,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { interestsEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { DocumentProps } from "src/renderer/types";
import { useState, useEffect } from "react";
import { delegateNames } from "../../components/Delegates";
import { useFileUpload } from "src/hooks/useFileUpload";
import { validateStarknetAddress } from "src/utils/helpers";

import {
  validateDiscordHandle,
  validateDiscourseUsername,
  validateTelegramHandle,
  validateTwitterHandle,
} from "src/utils/forms";

const interestsValues = interestsEnum.enumValues;

type FormValues = {
  statement: string;
  interests: string[];
  confirmDelegateAgreement: boolean;
  customDelegateAgreementContent?: string;
  starknetAddress: string;
  twitter: string;
  telegram: string;
  discord: string;
  discourse: string;
  understandRole: boolean;
};

export function Page() {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isValid },
    setError,
  } = useForm<FormValues>({
    mode: "onChange",
  });
  const { editorValue, handleEditorChange } = useMarkdownEditor("");
  const [error, setErrorField] = useState("");
  const {
    handleEditorFocus,
    hasInteracted,
    editorValue: customAgreementEditorValue,
    handleEditorChange: handleCustomAgreementEditorChange,
  } = useMarkdownEditor("");

  const { handleUpload } = useFileUpload();

  const [showCustomAgreementEditor, setShowCustomAgreementEditor] =
    useState(false);
  const [agreementType, setAgreementType] = useState<
    "standard" | "custom" | null
  >(null);

  const createDelegate = trpc.delegates.saveDelegate.useMutation();
  const { data: user } = trpc.users.me.useQuery();

  useEffect(() => {
    if (user?.starknetAddress) {
      setValue("starknetAddress", user.starknetAddress);
      if (!validateStarknetAddress(user.starknetAddress)) {
        setError("starknetAddress", {
          type: "manual",
          message: "Invalid Starknet address.",
        });
      }
    }
  }, [user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = editorValue;
      if (showCustomAgreementEditor) {
        data.customDelegateAgreementContent = customAgreementEditorValue;
      }
      await createDelegate
        .mutateAsync(data as FormValues)
        .then((res) => {
          window.location.href = `/delegates/profile/${res.id}`;
          setErrorField("");
        })
        .catch((err) => {
          console.log(err);
          setErrorField(err?.message ? err.message : JSON.stringify(err));
        });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <Box maxWidth="670px" pb="200px" mx="auto">
          <Heading variant="h2" mb="24px">
            Create delegate profile
          </Heading>

          <form onSubmit={onSubmit}>
            <Stack spacing="standard.xl" direction={{ base: "column" }}>
              <FormControlled
                label="Delegate pitch"
                isError={editorValue.length === 0}
                isRequired
                errorMessage="This field is required."
              >
                <MarkdownEditor
                  onFocus={handleEditorFocus}
                  onChange={handleEditorChange}
                  value={editorValue}
                  handleUpload={handleUpload}
                />
              </FormControlled>
              <FormControlled
                label="Delegate interests"
                isError={!!errors.interests}
                isRequired
                errorMessage="This field is required."
              >
                <Controller
                  name="interests"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Multiselect
                      options={interestsValues.map((option) => ({
                        value: option,
                        label: delegateNames?.[option] ?? option,
                      }))}
                      value={field.value as any}
                      onChange={(values) => field.onChange(values)}
                    />
                  )}
                />
              </FormControlled>

              <FormControlled
                label="Starknet wallet address"
                isError={
                  !!errors.starknetAddress && !!errors.starknetAddress.message
                }
                isRequired
                errorMessage="This field is required."
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="0x..."
                  {...register("starknetAddress", {
                    required: true,
                    validate: (value) =>
                      validateStarknetAddress(value) ||
                      "Invalid Starknet address",
                  })}
                />
              </FormControlled>

              <FormControlled
                label="Twitter"
                isError={!!errors.twitter && !!errors.twitter.message}
                errorMessage="Invalid Twitter handle."
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("twitter", {
                    validate: (value) => validateTwitterHandle(value),
                  })}
                />
              </FormControlled>

              <FormControlled
                label="Telegram"
                isError={!!errors.telegram && !!errors.telegram.message}
                errorMessage="Invalid Telegram handle."
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("telegram", {
                    validate: (value) => validateTelegramHandle(value),
                  })}
                />
              </FormControlled>

              <FormControlled
                label="Discord"
                isError={!!errors.discord && !!errors.discord.message}
                errorMessage="Invalid Discord handle."
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="name#1234"
                  {...register("discord", {
                    validate: (value) => validateDiscordHandle(value),
                  })}
                />
              </FormControlled>

              <FormControlled
                label="Discourse"
                isError={!!errors.discourse && !!errors.discourse.message}
                errorMessage="Invalid Discourse username."
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="your_username"
                  {...register("discourse", {
                    validate: (value) => validateDiscourseUsername(value),
                  })}
                />
              </FormControlled>

              <Divider />
              <Box>
                <Heading
                  variant="h3"
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  color="content.accent.default"
                >
                  Delegate agreement
                </Heading>
                <Text color="content.default.default" variant="medium">
                  Add a delegate agreement for the people who delegate to you
                </Text>
              </Box>
              <FormControlled
                isError={
                  !!errors.confirmDelegateAgreement &&
                  !!errors.confirmDelegateAgreement.message
                }
                errorMessage="Please select an agreement type."
              >
                <RadioGroup
                  value={agreementType}
                  onChange={(value) => {
                    if (value === "standard") {
                      setAgreementType("standard");
                      setShowCustomAgreementEditor(false);
                      setValue("confirmDelegateAgreement", true);
                    } else if (value === "custom") {
                      setAgreementType("custom");
                      setShowCustomAgreementEditor(true);
                      setValue("confirmDelegateAgreement", false);
                    }
                  }}
                >
                  <Stack spacing={5} direction="column">
                    <Radio value="standard">
                      I agree with the Starknet foundation suggested delegate
                      agreement View.
                    </Radio>
                    <Radio value="custom">
                      I want to provide a custom delegate agreement.
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControlled>

              {agreementType === "custom" && (
                <FormControlled
                  label="Custom Delegate Agreement"
                  isError={
                    !!errors.customAgreementEditor &&
                    !!errors.customAgreementEditor.message
                  }
                  errorMessage="Please provide a custom delegate agreement."
                >
                  <MarkdownEditor
                    onChange={handleCustomAgreementEditorChange}
                    value={customAgreementEditorValue}
                    handleUpload={handleUpload}
                  />
                </FormControlled>
              )}
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
                <Button type="submit" variant="primary">
                  Submit delegate profile
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
  title: "Delegates / Create",
} satisfies DocumentProps;
