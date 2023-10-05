import { Box, Flex } from "@chakra-ui/react";
import { VoteAbstainIcon, VoteAgainstIcon, VoteForIcon } from "src/Icons";
import { Text } from "src/Text";
import {
  VoteAbstainIconFilled,
  VoteAgainstIconFilled,
  VoteForIconFilled,
} from "../Icons/UiIcons";
import { Button } from "../Button";

type Props = {
  label: string;
  type: keyof typeof currentVariation | undefined;
  active?: boolean;
  onClick?: () => void;
};
const currentVariation = {
  For: "content.success.default",
  Against: "content.danger.default",
  Abstain: "content.default.selected",
};
//todo: add some kind of animation for voting
export const VoteButton = ({
  active,
  label = "label",
  type = "For",
  onClick,
}: Props) => {
  return (
    <Button
      onClick={onClick}
      variant="special"
      width="100%"
      isDisabled={active}
      color={active ? currentVariation[type] : "content.default.default"}
      borderColor={active ? currentVariation[type] : "border.forms"}
      sx={{
        "&:hover": {
          color: active ? currentVariation[type] : "content.default.default",
        },
      }}
    >
      <Flex
        gap="standard.base"
        flexDirection="column"
        justify="center"
        alignItems="center"
      >
        {type === "For" && (
          <>{active ? <VoteForIconFilled /> : <VoteForIcon />}</>
        )}
        {type === "Against" && (
          <>{active ? <VoteAgainstIconFilled /> : <VoteAgainstIcon />}</>
        )}
        {type === "Abstain" && (
          <>{active ? <VoteAbstainIconFilled /> : <VoteAbstainIcon />}</>
        )}
        <Box>
          <Text variant="mediumStrong">{label}</Text>
        </Box>
      </Flex>
    </Button>
  );
};
