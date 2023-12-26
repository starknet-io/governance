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
  title?: string;
  children: React.ReactNode;
  fixedHeader?: boolean;
  overflowY?: 'hidden' | 'auto' | 'scroll' | undefined;
  mobile?: "full" | "auto";
}
interface CustomModalFooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<CustomModalFooterProps> = ({ children }) => (
  <ModalFooter p="0">{children}</ModalFooter>
);

  export const Modal = ({ title, children, fixedHeader = false, mobile = "auto", overflowY = "auto", ...modalProps }: CustomModalProps) => {
    return (
      <ChakraModal
        motionPreset="slideInBottom"
        isCentered
        variant="unstyled"
        blockScrollOnMount={false}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="standard.lg"
          mx={{ base: "2.5", lg: "16" }}
          maxHeight={{ base: "100%", md: "80%", lg: "60%" }}
          overflowY={overflowY}
          sx={{
            '@media (max-width: 768px)': {
              width: '100vw',
              maxW: '100vw',
              h: mobile === "full" ? '100vh' : "auto",
              maxH: mobile === "full" ? '100vh' : "auto",
              margin: 0,
              borderRadius: mobile === "full" ? 0 : "standard.lg",
              placeSelf: mobile === "full" ? "stretch" : "self-end",
              borderBottomLeftRadius: mobile === "full" ? "standard.lg" : 0,
              borderBottomRightRadius: mobile === "full" ? "standard.lg" : 0,
            },
          }}
        >
          {title ? <ModalHeader sx={{
            '@media (max-width: 768px)': {
              position: fixedHeader ? "fixed" : "absolute",
              top: "0",
              left: "0",
              zIndex: "1",
              bg: "surface.cards.default",
              py: "standard.lg",
              width: "100vw",
              paddingLeft: mobile === "full" ? "2rem" : 0,
              paddingRight: mobile === "full" ? "2rem" : 0
            }
          }}>
            <Heading textAlign={"center"} pl={8} pr={8} variant={(modalProps.size === "sm" || modalProps.size === "smBodyMd") ? "h4" : "h3"} mb="0">{title}</Heading>
            <ModalCloseButton
              top="12px"
              right="12px"
              width="44px"
              height="44px"
              borderRadius="standard.base"
              borderBottomLeftRadius="md"
              color="#323232"
              zIndex="2"
              sx={{
                '@media (max-width: 768px)': {
                  position: "absolute"
              }
            }}
            />
          </ModalHeader> : null}
          <ModalBody
            sx={{
              paddingLeft: "0",
              paddingRight: "0",
              paddingBottom: "0",
              paddingTop: "0",
              '@media (max-width: 768px)': {
                paddingTop: title ? "53px" : "0",
              }
            }}
          >
            {children}
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    );
  };
  Modal.Footer = Footer;
