import { Box, Flex, Icon } from "@chakra-ui/react";
import { Button } from "src/Button";
import {
  ExternalLinkIcon,
  SignatureIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "src/Icons";
import { Link } from "src/Link";
import { Text } from "src/Text";
import { Tooltip } from "src/Tooltip";
import { formatVotesAmount, truncateAddress } from "src/utils";
import { CopyToClipboard } from "../CopyToClipboard";

type Props = {
  address: string;
  ethAddress?: string;
  voteCount: number;
  comment?: string;
  voted: "For" | "Against" | "Abstain";
  author?: string | null;
  signature?: string | null;
};

const variant = {
  For: "#20AC70",
  Against: "#E1503E",
  Abstain: "#6B6B80",
};

export const VoteComment = ({
  address,
  ethAddress,
  voted,
  voteCount,
  comment,
  author,
  signature,
  tx,
}: Props) => {
  const formatVotes = formatVotesAmount(voteCount);
  const renderAuthorOrAddress = () => {
    const content = (
      <CopyToClipboard text={address}>
        <Text variant="smallStrong" color="content.accent.default">
          {author || (ethAddress ? ethAddress : truncateAddress(address))}
        </Text>
      </CopyToClipboard>
    );

    return !author ? (
      <Tooltip label={ethAddress ? ethAddress : address} aria-label="Address">
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <Flex
      flexDirection="column"
      gap="standard.base"
      borderBottom="1px solid"
      borderColor="border.forms"
      mb="standard.sm"
      pb="standard.sm"
    >
      <Flex
        flexDirection="row"
        gap="standard.xs"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box>
          {voted === "For" && (
            <VoteForIcon boxSize="18px" color={variant[voted]} />
          )}
          {voted === "Against" && (
            <VoteAgainstIcon boxSize="18px" color={variant[voted]} />
          )}
          {voted === "Abstain" && (
            <VoteAbstainIcon boxSize="18px" color={variant[voted]} />
          )}
        </Box>

        <Box>{renderAuthorOrAddress()}</Box>

        <Flex
          height="100%"
          ml="auto"
          justifyContent={"center"}
          gap="standard.xs"
        >
          <Flex
            height="100%"
            alignItems={"center"}
            top="3px"
            position="relative"
          >
            <Text variant="smallStrong" color="content.support.default">
              {formatVotes} votes
            </Text>
          </Flex>
          {tx ? (
            <Box as="span" top="-1px" position="relative">
              <Link
                href={`https://starkscan.co/tx/${tx}`}
                size="small"
                isExternal
                hasArrow={false}
                padding="0"
                borderBottom={"0"}
                sx={{
                  _hover: { textDecoration: "none", borderBottom: "none" },
                }}
              >
                <ExternalLinkIcon color="#86848D" boxSize="16px" />
              </Link>
            </Box>
          ) : (
            <Box as="span" top="1px" position="relative">
              <Link
                href={`https://signator.io/view?ipfs=${signature}` || ""}
                size="small"
                isExternal
                hasArrow={false}
                padding="0"
                borderBottom={"0"}
                sx={{
                  _hover: { textDecoration: "none", borderBottom: "none" },
                }}
              >
                <SignatureIcon boxSize="24px" />
              </Link>
            </Box>
          )}
        </Flex>
      </Flex>
      <Box maxWidth={{ base: "500px", md: "800px", lg: "380px" }}>
        <Text
          width="100%"
          sx={{ whiteSpace: "pre-wrap" }}
          variant="small"
          color="content.default.default"
        >
          {comment}
        </Text>
      </Box>
    </Flex>
  );
};
