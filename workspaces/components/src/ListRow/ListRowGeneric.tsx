import { Badge, Box, Flex, Icon } from "@chakra-ui/react";
import {
  HiHandThumbUp,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { Text } from "../Text";

type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <Box
      mt="24px"
      display="flex"
      flexDirection="column"
      borderTop="1px solid #ECEDEE"
    >
      {children}
    </Box>
  );
};

type RootProps = {
  children: React.ReactNode;
  href?: string;
};

const Root = ({ children, href }: RootProps) => {
  return (
    <Box
      as="a"
      href={href}
      display="flex"
      flexDirection="row"
      gap="16px"
      borderBottom="1px solid #ECEDEE"
      minHeight="68px"
      alignItems="center"
      _hover={{
        textDecoration: "none",
        backgroundColor: "#F9FAFB",
      }}
    >
      {children}
    </Box>
  );
};

type StatusProps = {
  status: string | null;
  width?: string | null;
};

const Status = ({ status, width = "100" }: StatusProps) => {
  return (
    <Box minWidth={`${width}px`} justifyContent="flex-end" display="flex">
      <Badge variant={status ?? "outline"}>{status}</Badge>
    </Box>
  );
};

type TitleProps = {
  label: string | null;
};

const Title = ({ label }: TitleProps) => {
  return (
    <Box flex="1">
      <Text variant="cardBody" noOfLines={1} fontWeight="500">
        {label}
      </Text>
    </Box>
  );
};

type DateProps = {
  label?: string | null;
};

const Date = () => {
  return (
    <Box>
      <Text variant="breadcrumbs" noOfLines={1} fontWeight="500">
        Ending in - days
      </Text>
    </Box>
  );
};

type MutedTextProps = {
  type: "snip" | "vote" | null;
  id: number;
};

const MutedText = ({ type, id }: MutedTextProps) => {
  return (
    <Box textTransform={"uppercase"} minWidth="60px">
      <Text variant="breadcrumbs" color="#6B7280">
        {type === "snip" ? "SNIP" : "Vote"} {id}
      </Text>
    </Box>
  );
};

type VoteProps = {
  type: "snip" | "vote" | null;
  id: number;
};

const Vote = ({ type, id }: VoteProps) => {
  return (
    <Box textTransform={"uppercase"} minWidth="60px">
      Vote status
    </Box>
  );
};

type PastVotesProps = {
  title?: string | null;
  voteCount?: number;
  votePreference?: "for" | "against" | "abstain";
};

const PastVotes = ({ title, voteCount, votePreference }: PastVotesProps) => {
  return (
    <Flex flexDirection="column" flex={1} gap="6px">
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="#292932"
      >
        Support for scoped storage variables
      </Text>
      <Text variant="breadcrumbs" noOfLines={1} fontWeight="500">
        Voted
        <Icon
          fontSize="16px"
          position="relative"
          top="3px"
          mx="4px"
          as={HiHandThumbUp}
          color="#20AC70"
        />{" "}
        with 7M votes
      </Text>
    </Flex>
  );
};

type CommentSummaryProps = {
  type?: string;
  id?: number;
};

const CommentSummary = ({ type, id }: CommentSummaryProps) => {
  return (
    <Flex flexDirection="column" flex={1} gap="6px">
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="#292932"
      >
        Support for scoped storage variables
      </Text>
      <Text
        color="#6C6C75"
        variant="breadcrumbs"
        noOfLines={1}
        fontWeight="500"
      >
        “Our goal is to grow the Starknet ecosystem and make sure that
        developers from web2 can...”
      </Text>
    </Flex>
  );
};

type CommentsProps = {
  count: number | null;
  width?: string | null;
};

const Comments = ({ count, width }: CommentsProps) => {
  return (
    <Box
      minWidth={`${width}px`}
      display="flex"
      flexDirection="row"
      gap="4px"
      alignItems="center"
    >
      <Icon as={HiOutlineChatBubbleLeftEllipsis} />{" "}
      <Text variant="breadcrumbs" color="#6B7280">
        {count}
      </Text>
    </Box>
  );
};

export {
  Root,
  Status,
  Title,
  Date,
  MutedText,
  Vote,
  PastVotes,
  CommentSummary,
  Comments,
  Container,
};
