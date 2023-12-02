import { isValidElement, Children } from "react";
import {
    Modal as ChakraModal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    ModalFooter
} from "@chakra-ui/react";
import { Heading } from "../Heading";
interface CustomModalProps extends Omit<ModalProps, 'children'> {
  title: string;
  children: React.ReactNode;
  overflowY?: 'hidden' | 'auto' | 'scroll' | undefined;
}
interface CustomModalFooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<CustomModalFooterProps> = ({ children }) => (
  <ModalFooter p="0" mt="standard.md">{children}</ModalFooter>
);

  export const Modal = ({ title, children, overflowY = "auto", ...modalProps }: CustomModalProps) => {
    return (
      <ChakraModal
        motionPreset="slideInBottom"
        isCentered
        variant="unstyled"
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="standard.lg"
          mx={{ base: "2.5", lg: "16" }}
          maxHeight={{ base: "100%", md: "80%", lg: "60%" }}
          overflowY={overflowY}
        >
          <ModalHeader>
            <Heading textAlign={"center"} pl={8} pr={8} variant="h3" mb="0">{title}</Heading>
          </ModalHeader>
          <ModalCloseButton
            top="12px"
            right="12px"
            width="44px"
            height="44px"
            borderRadius="standard.base"
            borderBottomLeftRadius="md"
            color="#323232"
          />
          <ModalBody
            p="0"
          >
            {children}
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    );
  };
  Modal.Footer = Footer;
