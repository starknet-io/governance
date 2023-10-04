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
  Banner,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { interestsEnum } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { DocumentProps } from "src/renderer/types";
import { useState, useEffect } from "react";
import { delegateNames } from "../../components/Delegates";
import { useFileUpload } from "src/hooks/useFileUpload";
import { validateStarknetAddress } from "src/utils/helpers";

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
    setError,
  } = useForm<FormValues>({
    mode: "onChange",
  });
  const { editorValue, handleEditorChange } = useMarkdownEditor("");
  const [error, setErrorField] = useState("");
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
            <Stack spacing="24px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Delegate pitch</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  handleUpload={handleUpload}
                />
                {errors.statement && <span>This field is required.</span>}
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
                    validate: (value) =>
                      validateStarknetAddress(value) ||
                      "Invalid Starknet address",
                  })}
                />
                {errors.starknetAddress && (
                  <Text>{errors.starknetAddress.message || "This field is required."}</Text>
                )}
              </FormControl>
              <FormControl id="twitter">
                <FormLabel>Twitter (optional)</FormLabel>
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("twitter")}
                />
              </FormControl>
              <FormControl id="telegram">
                <FormLabel>Telegram (optional)</FormLabel>
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="@yourhandle"
                  {...register("telegram")}
                />
              </FormControl>
              <FormControl id="discord">
                <FormLabel>Discord (optional)</FormLabel>
                <Input
                  variant="primary"
                  size="standard"
                  placeholder="name#1234"
                  {...register("discord")}
                />
              </FormControl>
              <FormControl id="discourse">
                <FormLabel>Discourse (optional)</FormLabel>
                <Input
                  variant="primary"
                  size="standard"
                  placeholder="yourusername"
                  {...register("discourse")}
                />
              </FormControl>
              <Divider />
              <Box>
                <Heading variant="h3" display="flex" alignItems="center" gap={1.5}>
                  Delegate agreement <Text variant="largeStrong">(optional)</Text>
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
