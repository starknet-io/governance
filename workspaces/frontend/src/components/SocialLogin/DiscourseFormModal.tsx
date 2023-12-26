import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Flex, Heading, Input, Text } from "@yukilabs/governance-components";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

type DiscourseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  delagateId: string;
  onSuccess?: () => void;
};

export const DiscourseFormModal = ({
  isOpen,
  onClose,
  delagateId,
  onSuccess,
}: DiscourseFormModalProps) => {
  const [discourseAddress, setDiscourseAddress] = useState("");
  const addDiscourse = trpc.socials.addDiscourse.useMutation();
  const [state, setState] = useState<"loading" | "error" | null>(null);

  const close = () => {
    setDiscourseAddress("");
    onClose();
  };

  const onSave = ({
    delegateId,
    username,
  }: {
    delegateId: string;
    username: string;
  }) => {
    addDiscourse.mutateAsync(
      {
        delegateId,
        username,
      },
      {
        onSuccess: () => {
          setState(null);
          setDiscourseAddress("");
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: () => {
          setState("error");
        },
      },
    );
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={close}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="xl" overflow="hidden">
        <form>
          <ModalHeader
            display="flex"
            justifyContent="center"
            pt="0.5rem"
            pb={0}
          >
            <Heading variant="h3" color="content.accent.default">
              Add Discourse
            </Heading>
          </ModalHeader>
          <ModalCloseButton
            top="standard.xl"
            right="standard.xl"
            size="lg"
            borderRadius="none"
            borderBottomLeftRadius="md"
          />
          <ModalBody py="standard.xl">
            <FormControl>
              <FormLabel>
                <Text
                  as="h5"
                  variant="bodyMediumStrong"
                  color="content.default.default"
                >
                  Discourse username
                </Text>
              </FormLabel>
              <Input
                placeholder="Name"
                value={discourseAddress}
                onChange={(e) => setDiscourseAddress(e.target.value)}
              />
              {state === "error" && discourseAddress !== "" && (
                <FormErrorMessage>
                  Something went wrong, please try again later
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter p={0} px="standard.xl" mt="standard.xl">
            <Flex flex={1} gap="12px">
              <Button width={"100%"} variant={"ghost"} onClick={close}>
                Cancel
              </Button>
              <Button
                width={"100%"}
                isLoading={state === "loading"}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  onSave({
                    delegateId: delagateId,
                    username: discourseAddress,
                  });
                }}
              >
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
