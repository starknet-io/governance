import React, { useEffect, useState } from "react";
import {
  Flex,
  Input,
  Stack,
  useDisclosure,
  Box,
  InputGroup,
} from "@chakra-ui/react";
import { Modal } from "../Modal";
import { Text } from "../Text";
import {
  CopyIcon,
  DiscordIcon,
  DiscourseIcon,
  ShareIcon,
  TelegramIcon,
  TwitterIcon,
} from "src/Icons/UiIcons";
import { Button } from "src/Button";

export const ShareDialog: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUrl, setCurrentUrl] = useState("");
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const link = currentUrl;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (
        path.startsWith("/voting-proposals/") ||
        path.startsWith("/delegates/profile/") ||
        path.startsWith("/learn") ||
        path.includes("/posts/")
      ) {
        setCurrentUrl(window.location.href);
        setShouldDisplay(true);
      } else {
        setShouldDisplay(false);
      }
    }
  }, [typeof window !== "undefined" ? window.location.href : ""]);

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

  return (
    <>
      <Button
        variant={"ghost"}
        size="condensed"
        leftIcon={<ShareIcon />}
        onClick={onOpen}
      >
        Share
      </Button>

      <Modal
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        title="Share"
      >
        <>
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
              icon={<TwitterIcon />}
              label="Twitter"
              onClick={shareTwitter}
              flex="1"
              mr="3"
            />
            <LinkBox
              icon={<TelegramIcon />}
              label="Telegram"
              onClick={shareTelegram}
              flex="1"
            />
          </Flex>
        </>
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
