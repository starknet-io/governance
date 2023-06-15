import { Box, Flex, HStack, Icon } from "@chakra-ui/react";
import { MdStopCircle, MdThumbDownAlt, MdThumbUpAlt } from "react-icons/md";

type Props = {
  label: string;
  type: "for" | "against" | "abstain";
  active?: boolean;
  onClick?: () => void;
};
const currentVariation = {
  for: "#20AC70",
  against: "#E1503E",
  abstain: "#6C6C75",
};
//todo: add some kind of animation for voting
export const VoteButton = ({
  active,
  label = "label",
  type = "for",
  onClick,
}: Props) => {
  return (
    <Box
      onClick={onClick}
      as="button"
      minHeight="64px"
      lineHeight="1.2"
      border="1px"
      px="8px"
      width="100%"
      borderRadius="6px"
      fontSize="13px"
      fontWeight="500"
      bg="#FFFFFF"
      borderColor="rgba(0, 0, 0, 0.04)"
      boxShadow=" 0px 1px 2px rgba(0, 0, 0, 0.04)"
      color={active ? currentVariation[type] : "#6C6C75"}
      _hover={{ bg: active ? "white" : "#fafafa" }}
      _active={{
        bg: "#eaeaea",
        // transform: "scale(0.98)",
        // borderColor: "#bec3c9",
      }}
      _focus={{
        boxShadow: "0 0 1px 2px rgba(88, 144, 255, .75)",
      }}
    >
      <Flex
        gap="8px"
        flexDirection="column"
        justify="center"
        alignItems="center"
      >
        {type === "for" && (
          <Icon as={MdThumbUpAlt} boxSize="16px" aria-label="For" />
        )}
        {type === "against" && (
          <Icon as={MdThumbDownAlt} boxSize="16px" aria-label="For" />
        )}
        {type === "abstain" && (
          <Icon as={MdStopCircle} boxSize="16px" aria-label="For" />
        )}

        <Box>{label}</Box>
      </Flex>
    </Box>
  );
};
