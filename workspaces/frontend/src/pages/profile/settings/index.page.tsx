import React, { useEffect, useState } from "react";
import { DocumentProps } from "../../../renderer/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FormControlled,
  Input,
  Modal,
  PageTitle,
  ProfileImage,
  ShareIcon,
  UploadImage,
} from "@yukilabs/governance-components";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/dist/src/routers";
import { usePageContext } from "../../../renderer/PageContextProvider";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { trpc } from "../../../utils/trpc";
import { FormLayout } from "../../../components/FormsCommon/FormLayout";

export function Page() {
  const { user } = usePageContext();
  const { handleUpload } = useFileUpload();
  const utils = trpc.useContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<RouterInput["users"]["editUserProfile"]>();
  const editUserProfile = trpc.users.editUserProfile.useMutation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setLoading(true);
      const imageUrl = await handleUpload?.(selectedFile);
      setImageUrl(imageUrl as string);
      if (typeof imageUrl !== "string") {
        throw new Error("Invalid image URL returned.");
      }
      setLoading(false);
      onUploadClose();
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  const [userExistsError, setUserExistsError] = useState(false);

  useEffect(() => {
    setImageUrl(user?.profileImage);
    setValue("username", user?.username);
  }, [user]);

  const handleSave = async () => {
    await handleSubmit(async (data) => {
      const saveProfileData: any = {};
      saveProfileData.username = data.username;
      saveProfileData.profileImage = imageUrl;
      setLoading(true)

      try {
        const res = await editUserProfile.mutateAsync(
          {
            id: user.id,
            username:
              saveProfileData.username !== user?.username
                ? saveProfileData.username
                : null,
            profileImage: saveProfileData.profileImage,
          },
          {
            onSuccess: () => {
              utils.auth.currentUser.invalidate();
              setLoading(false)
              return true;
            },
            onError: (error) => {
              if (error.message === "Username already exists") {
                setUserExistsError(true);
              }
              setLoading(false)
              return false;
            },
          },
        );
        return res;
      } catch (error) {
        return false;
      }
    })();
  };

  const setUsernameErrorFalse = () => {
    setUserExistsError(false);
  };

  return (
    <FormLayout>
      <Stack spacing="standard.2xl" direction={{ base: "column" }}>
        <PageTitle
          learnMoreLink={undefined}
          title="User Profile Settings"
          description=""
          maxW={"580px"}
          mb={0}
        />
        <>
          <Modal
            isCentered
            isOpen={isUploadOpen}
            onClose={() => onUploadClose()}
            title="Upload avatar"
            size="md"
          >
            <>
              <UploadImage
                onImageSelected={handleImageSelected}
                loading={loading}
                closeModal={() => onUploadClose()}
              />
            </>
          </Modal>
          <Box
            mb="standard.xl"
            display={"flex"}
            flexDirection={"row"}
            w="100%"
            alignItems="center"
            gap="24px"
          >
            <Box>
              <ProfileImage imageUrl={imageUrl} size="medium" />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems="flex-start"
              gap="8px"
            >
              <Button
                variant={"secondary"}
                onClick={() => onUploadOpen()}
                spinner={<Spinner />}
                leftIcon={<ShareIcon />}
                size="standard"
              >
                Upload Avatar
              </Button>
            </Box>
            <Box>
              <Text variant="small" color={"content.default.default"}>
                We support PNGs, JPEGs and GIFs under 10MB
              </Text>
            </Box>
          </Box>
          <form>
            <Flex flexDirection="column" gap="standard.2xl" w="100%">
              <FormControlled
                name="username"
                isRequired={false}
                id="member-name"
                label="Username"
                isInvalid={!!userExistsError}
                errorMessage="Username already exists"
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="Username"
                  {...register("username")}
                  onChange={setUsernameErrorFalse}
                />
              </FormControlled>
              <Button onClick={handleSave} maxW="140px">
                {loading ? (
                  <Flex gap={1.5} alignItems="center">
                    <Spinner size="sm" />
                    <Text>Save Settings</Text>
                  </Flex>
                ) : (
                  <Text>Save Settings</Text>
                )}
              </Button>
            </Flex>
          </form>
        </>
      </Stack>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Profile Settings",
} satisfies DocumentProps;
