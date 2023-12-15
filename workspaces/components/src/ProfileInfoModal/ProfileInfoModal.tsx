import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Text,
  Spinner,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { validateStarknetAddress } from "@yukilabs/governance-frontend/src/utils/helpers";
import { UploadImage } from "src/UploadImage";
import { ProfileImage } from "src/ProfileImage";
import { ShareIcon } from "src/Icons";
import { Input } from "src/Input";
import { FormControlled } from "src/FormControlled";

interface ProfileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleUpload?: (file: File) => Promise<string | void> | void;
  user?: any;
  mode?: "create" | "edit";
  saveData?: (data: any) => void;
  userExistsError?: boolean;
  setUsernameErrorFalse?: () => void;
}

export const ProfileInfoModal = ({
  isOpen,
  onClose,
  handleUpload,
  user,
  mode = "edit",
  saveData,
  userExistsError = false,
  setUsernameErrorFalse,
}: ProfileInfoModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<RouterInput["users"]["editUserProfile"]>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setLoading(true);
      const imageUrl = await handleUpload?.(selectedFile);
      setImageUrl(imageUrl as string);
      if (typeof imageUrl !== "string") {
        throw new Error("Invalid image URL returned.");
      }
      setLoading(false);
      setIsUploadOpen(false);
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    setImageUrl(user?.profileImage);
    setValue("username", user?.username);
    setValue("starknetAddress", user?.starknetAddress);
  }, [user]);

  const handleSave = () => {
    handleSubmit((data) => {
      const saveProfileData: any = {};
      saveProfileData.username = data.username;
      saveProfileData.starknetAddress = data.starknetAddress;
      saveProfileData.profileImage = imageUrl;
      saveData?.(saveProfileData);
    })();
  };

  return (
    <>
      <Modal
        isCentered
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload avatar"
        size="md"
      >
        <>
          <UploadImage
            onImageSelected={handleImageSelected}
            loading={loading}
            closeModal={() => setIsUploadOpen(false)}
          />
        </>
      </Modal>
      <Modal
        isCentered
        isOpen={isOpen && !isUploadOpen}
        onClose={onClose}
        size="standard"
        title={`${mode === "create" ? "Add" : "Edit"} your profile info`}
      >
        <>
          <Box
            mb="standard.xl"
            display={"flex"}
            flexDirection={"row"}
            alignItems="center"
            gap="24px"
          >
            <Box>
              <ProfileImage imageUrl={imageUrl} size="medium" />
            </Box>
            <Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="flex-start"
                gap="8px"
              >
                <Button
                  variant={"secondary"}
                  onClick={() => setIsUploadOpen(true)}
                  spinner={<Spinner />}
                  leftIcon={<ShareIcon />}
                  size="standard"
                >
                  Upload Avatar
                </Button>
                <Text variant="small" color={"content.default.default"}>
                  We support PNGs, JPEGs and GIFs under 10MB
                </Text>
              </Box>
              <Box></Box>
            </Box>
          </Box>
          <form>
            <Flex flexDirection="column" gap="standard.xl">
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

              <FormControlled
                name="starknetAddress"
                isRequired={false}
                id="address"
                label="Starknet address"
                isInvalid={
                  !!errors.starknetAddress &&
                  errors.starknetAddress.type === "validate"
                }
                errorMessage="Invalid Starknet address"
              >
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="0x..."
                  {...register("starknetAddress", {
                    validate: (value) =>
                      validateStarknetAddress(value) ||
                      "Invalid Starknet address",
                  })}
                />
              </FormControlled>
            </Flex>
          </form>
          <Modal.Footer p={0} px="standard.xl" mt="standard.xl">
            <Flex flex={1} gap="12px">
              <Button width={"100%"} variant={"ghost"} onClick={onClose}>
                {mode === "create" ? "Skip" : "Cancel"}
              </Button>
              <Button width={"100%"} onClick={handleSave}>
                Save
              </Button>
            </Flex>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};
