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
            Upload Image
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
      <Modal isOpen={isOpen && !isUploadOpen} onClose={onClose}>
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
                    variant={"outline"}
                    onClick={() => setIsUploadOpen(true)}
                    spinner={<Spinner />}
                    leftIcon={<ShareIcon />}
                  >
                    <Text>Upload image</Text>
                  </Button>
                </Box>
                <Box>
                  <Text variant="small" color={"#86848D"}>
                    We support PNGs, JPEGs and GIFs under 10MB
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box mt={6}>
              <form style={{ width: "100%" }}>
                <FormControl id="member-name" paddingBottom={2}>
                  <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
                    Username
                  </FormLabel>
                  <Input
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
                    placeholder="0x..."
                    {...register("starknetAddress", {
                      validate: (value) =>
                        value === "" ||
                        validateStarknetAddress(value) ||
                        "Invalid Starknet address",
                    })}
                  />
                  {errors.starknetAddress && (
                    <span>{errors?.starknetAddress?.message}</span>
                  )}
                </FormControl>
              </form>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button width={"50%"} variant={"ghost"} mr={3} onClick={onClose}>
              {mode === "create" ? "Skip" : "Cancel"}
            </Button>
            <Button width={"50%"} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
