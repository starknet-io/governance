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
  Multiselect,
  useMarkdownEditor,
  MarkdownEditor,
  Text,
  Divider,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { interestsEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { DocumentProps } from "src/renderer/types";
import { useState, useEffect } from "react";
import { delegateNames } from "./index.page";
import { useFileUpload } from "src/hooks/useFileUpload";

const interestsValues = interestsEnum.enumValues;

type FormValues = {
  statement: string;
  interests: string[];
  confirmDelegateAgreement: boolean;
  customDelegateAgreementContent?: string;
  starknetAddress: string;
  twitter: string;
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
  } = useForm<FormValues>();
  const { editorValue, handleEditorChange } = useMarkdownEditor("");
  const {
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
        <Box maxWidth="670px" pb="200px" mx="auto">
          <Heading variant="h2" mb="24px">
            Create delegate profile
          </Heading>

          <form onSubmit={onSubmit}>
            <Stack spacing="24px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Delegate pitch</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  handleUpload={handleUpload}
                />
                {errors.statement && (
                  <span>This field is required.</span>
                )}
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Delegate type</FormLabel>
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
                {errors.interests && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="starknet-wallet-address">
                <FormLabel>Starknet wallet address</FormLabel>
                <Input
                  size="standard"
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
                  size="standard"
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
                  size="standard"
                  placeholder="name#1234"
                  {...register("discord")}
                />
                {errors.discord && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="discourse">
                <FormLabel>Discourse</FormLabel>
                <Input
                  variant="primary"
                  size="standard"
                  placeholder="yourusername"
                  {...register("discourse")}
                />
                {errors.discourse && <span>This field is required.</span>}
              </FormControl>
              <Divider />
              <Box>
                <Heading variant="h3">Delegate agreement</Heading>
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
              {agreementType === "custom" && (
                <FormControl id="custom-agreement-editor">
                  <FormLabel>Custom Delegate Agreement</FormLabel>
                  <MarkdownEditor
                    onChange={handleCustomAgreementEditorChange}
                    value={customAgreementEditorValue}
                    handleUpload={handleUpload}
                  />
                </FormControl>
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
                <Button type="submit" variant="primary" disabled={!isValid}>
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
