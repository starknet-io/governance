import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Box,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa";
import { Text } from "../Text";
import { Heading } from "src/Heading";
import { CopyIcon, ShareIcon } from "src/Icons/UiIcons";

export const ShareDialog: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUrl, setCurrentUrl] = useState("");
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const link = currentUrl || window.location.href;

  useEffect(() => {
    const path = window.location.pathname;
    if (
      path.startsWith("/voting-proposals/") ||
      path.startsWith("/delegates/profile/") ||
      path.startsWith("/learn")
    ) {
      setCurrentUrl(window.location.href);
      setShouldDisplay(true);
    } else {
      setShouldDisplay(false);
    }
  }, [window.location.href]);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  if (!shouldDisplay) return null;

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(link)}`,
      "_blank",
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(link)}`,
      "_blank",
    );
  };

  const shareDiscord = () => {
    alert("Discord share is not directly supported. Please copy the link.");
  };

  return (
    <>
      <Button
        transition="all 0.2s"
        _hover={{ bg: "#EEEEF1" }}
        _active={{ bg: "#EEEEF1" }}
        variant={"ghost"}
        leftIcon={<ShareIcon />}
        onClick={onOpen}
      >
        <Text
          marginRight="auto"
          fontSize={"14px"}
          fontWeight="400"
          lineHeight="20px"
          letterSpacing="0.07px"
          color="#4A4A4F"
        >
          Share
        </Text>
      </Button>

      <Modal
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        variant="unstyled"
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl" height={"250px"}>
          <ModalHeader textAlign="center">
            <Heading fontSize="21px" fontWeight="semibold" variant="h3">
              Share
            </Heading>
          </ModalHeader>
          <ModalCloseButton top="16px" />
          <ModalBody
            py={{ base: "4", md: "4", lg: "4" }}
            pb={{ base: "4" }}
            minHeight="272px"
          >
            <Stack spacing="4">
              <Text>Copy Link</Text>
            </Stack>

            <Box my="2">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  readOnly
                  value={link}
                  borderColor="#23192D1A"
                  _focusVisible={{ borderColor: "gray.300" }}
                />

                <Box>
                  <Button
                    variant={"ghost"}
                    _hover={{}}
                    _active={{}}
                    onClick={copyLink}
                    position={"absolute"}
                    top={"-2px"}
                    right={"-13px"}
                  >
                    <CopyIcon boxSize={"20px"} />
                  </Button>
                </Box>
              </InputGroup>
            </Box>

            <Flex justifyContent="space-between" width="100%" mt="24px">
              <LinkBox
                icon={<FaTwitter size="20px" />}
                label="Twitter"
                onClick={shareTwitter}
                flex="1"
                mr="3"
              />
              <LinkBox
                icon={<FaTelegramPlane size="20px" />}
                label="Telegram"
                onClick={shareTelegram}
                flex="1"
                mr="3"
              />
              <LinkBox
                icon={<FaDiscord size="20px" color="#363636" />}
                label="Discord"
                onClick={shareDiscord}
                flex="1"
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

type LinkBoxProps = {
  href?: string;
  icon?: React.ReactElement;
  label: string;
  onClick?: () => void;
  flex?: string;
  mr?: string;
};

const LinkBox = ({ href, icon, label, onClick, flex, mr }: LinkBoxProps) => {
  return (
    <Button
      href={href}
      as="a"
      variant="outline"
      target={"_blank"}
      size="lg"
      leftIcon={icon}
      flex={flex}
      onClick={onClick}
      justifyContent={"space-between"}
      height="44px"
      padding="12px 20px"
      marginRight={mr}
      cursor={"pointer"}
      _active={{}}
    >
      <Text
        marginRight="auto"
        fontSize={"14px"}
        fontWeight="500"
        lineHeight="20px"
        letterSpacing="0.07px"
        color="#4A4A4F"
      >
        {label}
      </Text>
    </Button>
  );
};
