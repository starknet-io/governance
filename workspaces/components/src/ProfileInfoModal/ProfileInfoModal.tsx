import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Spinner,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { validateStarknetAddress } from "@yukilabs/governance-frontend/src/utils/helpers";
import { UploadImage } from "src/UploadImage";
import { ProfileImage } from "src/ProfileImage";
import { ShareIcon } from "src/Icons";
import { Input } from "src/Input";

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

  useEffect(() => {
    console.log("userExistsError", errors);
  }, [errors]);

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
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            Upload avatar
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UploadImage
              onImageSelected={handleImageSelected}
              loading={loading}
              closeModal={() => setIsUploadOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen && !isUploadOpen} onClose={onClose} size="standard">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"xl"}
            display={"flex"}
            justifyContent={"center"}
          >
            {mode === "create" ? "Add" : "Edit"} your profile info
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              mb="24px"
              display={"flex"}
              flexDirection={"row"}
              alignItems="center"
            >
              <ProfileImage imageUrl={imageUrl} size="medium" />
              <Box ml="16px">
                <Box display={"flex"} flexDirection={"row"}>
                  <Button
                    variant={"secondary"}
                    onClick={() => setIsUploadOpen(true)}
                    spinner={<Spinner />}
                    leftIcon={<ShareIcon />}
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
            </Box>
            <Box mt={6}>
              <form>
                <FormControl id="member-name" paddingBottom={2}>
                  <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
                    Username
                  </FormLabel>
                  <Input
                    variant="primary"
                    size="standard"
                    placeholder="Username"
                    {...register("username")}
                    onChange={setUsernameErrorFalse}
                  />
                  {userExistsError && <span>Username already exists</span>}
                </FormControl>

                <FormControl id="address" paddingBottom={2}>
                  <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
                    Starknet address
                  </FormLabel>
                  <Input
                    variant="primary"
                    size="standard"
                    placeholder="0x..."
                    {...register("starknetAddress", {
                      validate: (value) => validateStarknetAddress(value),
                    })}
                  />
                  {errors.starknetAddress &&
                    errors.starknetAddress.type === "validate" && (
                      <span>Invalid Starknet address</span>
                    )}
                </FormControl>
              </form>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Flex flex={1} gap="12px">
              <Button width={"100%"} variant={"ghost"} onClick={onClose}>
                {mode === "create" ? "Skip" : "Cancel"}
              </Button>
              <Button width={"100%"} onClick={handleSave}>
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
