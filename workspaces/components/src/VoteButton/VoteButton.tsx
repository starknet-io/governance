import { Box, Flex, Icon } from "@chakra-ui/react";
import { VoteAbstainIcon, VoteAgainstIcon, VoteForIcon } from "src/Icons";

type Props = {
  label: string;
  type: keyof typeof currentVariation | undefined;
  active?: boolean;
  onClick?: () => void;
};
const currentVariation = {
  For: "#20AC70",
  Against: "#E1503E",
  Abstain: "#6C6C75",
};
//todo: add some kind of animation for voting
export const VoteButton = ({
  active,
  label = "label",
  type = "For",
  onClick,
}: Props) => {
  return (
    <Box
      onClick={onClick}
      as="button"
      minHeight="72px"
      lineHeight="1.2"
      border="1px"
      px="8px"
      width="100%"
      borderRadius="6px"
      fontSize="13px"
      bg="#FFFFFF"
      borderColor="rgba(35, 25, 45, 0.10)"
      boxShadow="  0px 1px 1px 0px rgba(0, 0, 0, 0.05)"
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
        {type === "For" && (
          <Icon as={VoteForIcon} boxSize="24px" aria-label="For" />
        )}
        {type === "Against" && (
          <Icon as={VoteAgainstIcon} boxSize="24px" aria-label="Against" />
        )}
        {type === "Abstain" && (
          <Icon as={VoteAbstainIcon} boxSize="25px" aria-label="Abstain" />
        )}

        <Box>{label}</Box>
      </Flex>
    </Box>
  );
};
