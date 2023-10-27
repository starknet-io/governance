import { Heading } from "../Heading";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Text } from "../Text";
import { RouterInput } from "@yukilabs/governance-backend/dist/src/routers";
import { Input } from "../Input";
import { FormControlled } from "../FormControlled";
import { useForm } from "react-hook-form";

interface EmailSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData?: (data: { email: string }) => void;
}

export const EmailSubscriptionModal = ({
  isOpen,
  onClose,
  saveData,
}: EmailSubscriptionModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RouterInput["subscriptions"]["subscribe"]>();

  const handleSave = () => {
    handleSubmit((data) => {
      const emailSubscriptionData: any = {};
      emailSubscriptionData.email = data.email;
      saveData?.(emailSubscriptionData);
    })();
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="standard">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"} p="0">
            <Heading variant="h4" mb="standard.xl">
              Email notifications
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0" px="standard.xl">
            <Text color="content.default.default" variant="small" mb={6} textAlign="center">
              Subscribe to receive email notifications about Starknet proposals,
              your delegate and replies to your comments
            </Text>
            <form>
              <Flex flexDirection="column" gap="standard.xl">
                <FormControlled
                  name="email"
                  isRequired={true}
                  id="email"
                  label="Email"
                >
                  <Input
                    size="standard"
                    variant="primary"
                    placeholder="Email"
                    {...register("email")}
                  />
                </FormControlled>
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter p={0} px="standard.xl" mt="standard.xl">
            <Flex flex={1} gap="12px">
              <Button width={"100%"} onClick={handleSave}>
                Subscribe
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
