import {
  Flex,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { Text } from "../Text";
import { RouterInput } from "@yukilabs/governance-backend/dist/src/routers";
import { Input } from "../Input";
import { FormControlled } from "../FormControlled";
import { useForm } from "react-hook-form";
import { validateEmailAddress } from "@yukilabs/governance-frontend/src/utils/helpers";
import { Modal } from "../Modal";

interface EmailSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  saveData?: (data: { email: string }) => void;
}

export const EmailSubscriptionModal = ({
  isOpen,
  onClose,
  isLoading,
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
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="standard"
        title="Email notifications"
      >
        <form onSubmit={handleSave}>
          <Text
            color="content.default.default"
            variant="small"
            mb={6}
            textAlign="center"
          >
            Subscribe to receive email notifications about Starknet
            proposals, your delegate and replies to your comments
          </Text>
          <Flex flexDirection="column" gap="standard.xl">
            <FormControlled
              name="email"
              isRequired={true}
              id="email"
              label="Email"
              isInvalid={!!errors.email}
              errorMessage={
                errors.email?.message || "Not a valid email address"
              }
            >
              <Input
                size="standard"
                variant="primary"
                placeholder="Email"
                {...register("email", {
                  required: true,
                  validate: (value) =>
                    validateEmailAddress(value) || "Invalid Email address",
                })}
              />
            </FormControlled>
          </Flex>
          <Modal.Footer>
            <Flex flex={1} gap="12px">
              <Button width={"100%"} onClick={handleSave}>
                <Flex gap={1.5}>
                  {isLoading && <Spinner size="sm" />}
                  <Text>Subscribe</Text>
                </Flex>
              </Button>
            </Flex>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
