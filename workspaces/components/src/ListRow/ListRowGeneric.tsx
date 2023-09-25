import { Badge, Box, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { Text } from "../Text";
import {
  differenceInDays,
  differenceInHours,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import {
  CommentIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "src/Icons";
import { MarkdownRenderer } from "src/MarkdownRenderer";
import "./styles.css";

type Props = BoxProps & {
  children?: React.ReactNode;
};

const Container = ({ children, ...rest }: Props) => {
  return (
    <Box mt="24px" display="flex" flexDirection="column" {...rest}>
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
      gap="32px"
      borderBottom="1px solid #ECEDEE"
      minHeight="68px"
      alignItems="center"
      _hover={{
        textDecoration: "none",
        backgroundColor: "#F9FAFB",
      }}
      width={"100%"}
    >
      {children}
    </Box>
  );
};

type StatusProps = {
  status: string | null | undefined;
  width?: string | null;
};

const Status = ({ status, width = "80" }: StatusProps) => {
  return (
    <Box minWidth={`${width}px`} justifyContent="flex-end" display="flex">
      <Badge variant={status ?? "outline"}>{status}</Badge>
    </Box>
  );
};

type TitleProps = {
  label: string | null | undefined;
};

const Title = ({ label = "" }: TitleProps) => {
  return (
    <Box flex="1">
      <Text variant="cardBody" noOfLines={1} fontWeight="500">
        {label}
      </Text>
    </Box>
  );
};

// type DateProps = {
//   label?: string | null;
// };

const CustomDate = () => {
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
        {type === "snip" ? "SNIP" : "Vote"} {id.toString().padStart(3, "0")}
      </Text>
    </Box>
  );
};

type CategoryProps = {
  category: string;
};

const CategoryText = ({ category }: CategoryProps) => {
  return (
    <Box textTransform={"capitalize"}>
      <Text variant="breadcrumbs" color="#6B7280">
        {category}
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
  body?: string | null;
  voteCount?: number | null;
  votePreference?: "for" | "against" | "abstain";
};

const PastVotes = ({
  title = "Support for scoped storage variables",
  voteCount = 7,
  votePreference,
  body = "",
}: PastVotesProps) => {
  const renderIconBasedOnVotePreference = () => {
    switch (votePreference) {
      case "for":
        return VoteForIcon;
      case "against":
        return VoteAgainstIcon;
      case "abstain":
        return VoteAbstainIcon;
      default:
        return VoteForIcon;
    }
  };
  return (
    <Flex flexDirection="column" flex={1} gap="6px">
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="#292932"
      >
        {title}
      </Text>
      <Text variant="breadcrumbs" noOfLines={1} fontWeight="500">
        Voted
        <Icon
          fontSize="16px"
          position="relative"
          top="3px"
          mx="4px"
          as={renderIconBasedOnVotePreference()}
          color="#20AC70"
        />{" "}
        with {voteCount} votes <MarkdownRenderer content={body ?? ""} />
      </Text>
    </Flex>
  );
};

type CommentSummaryProps = {
  type?: string;
  id?: number;
  postTitle: string;
  comment: string;
};

const CommentSummary = ({
  type,
  id,
  postTitle,
  comment,
}: CommentSummaryProps) => {
  return (
    <Flex flexDirection="column" flex={1} gap="6px">
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="#292932"
      >
        {postTitle}
      </Text>
      <Text
        color="#6C6C75"
        variant="breadcrumbs"
        noOfLines={1}
        fontWeight="500"
      >
        <MarkdownRenderer content={comment ?? ""} />
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
      <Icon as={CommentIcon} />
      <Text variant="breadcrumbs" color="#6B7280">
        {count}
      </Text>
    </Box>
  );
};

function dateDiff(now: Date, futureDate: Date) {
  let unit = "day";
  let count = differenceInDays(futureDate, now);

  if (count === 0) {
    count = differenceInHours(futureDate, now);
    unit = "hour";
  } else if (count >= 7 && count < 30) {
    count = differenceInWeeks(futureDate, now);
    unit = "week";
  } else if (count >= 30 && count < 365) {
    count = differenceInMonths(futureDate, now);
    unit = "month";
  } else if (count >= 365) {
    count = differenceInYears(futureDate, now);
    unit = "year";
  }

  unit = count > 1 ? unit + "s" : unit; // pluralize the unit if necessary
  return `${count} ${unit}`;
}

type DateRangeProps = {
  start?: number;
  end?: number;
  state: string | null | undefined;
};

const DateRange = ({ start, end, state }: DateRangeProps) => {
  const now = new Date();

  const startDate = start ? new Date(start * 1000) : new Date();
  const endDate = end ? new Date(end * 1000) : new Date();

  let dateText = "";
  if (state === "pending") {
    dateText = "Starting in " + dateDiff(now, startDate);
  } else if (state === "active") {
    dateText = "Ending in " + dateDiff(now, endDate);
  } else if (state === "closed") {
    dateText = "Ended " + dateDiff(endDate, now) + " ago";
  }
  return (
    <Box width="120px">
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="#6C6C7A"
      >
        {dateText}
      </Text>
    </Box>
  );
};

const colors: { [key: string]: string } = {
  For: "#29AB87",
  Against: "#E54D66",
  Abstain: "#6C6C7A",
  Yes: "#29AB87",
  No: " #6C6C7A",
};

interface VoteResultsProps {
  choices: string[];
  scores: number[];
}

const VoteResults: React.FC<VoteResultsProps> = ({ choices, scores }) => {
  const total = scores.reduce((a, b) => a + b, 0);
  const noVotes = total === 0;
  const onlyOneVote = total === Math.max(...scores);
  return (
    <Box
      display="flex"
      width="100%"
      maxWidth="74px"
      gap="2px"
      overflow="hidden"
    >
      {choices.map((choice, i) => {
        const rawVotePercentage = (scores[i] / total) * 100;
        const votePercentage = isNaN(rawVotePercentage)
          ? 0
          : rawVotePercentage.toFixed(2);
        const voteCount = scores[i] || 0;
        const isNoVote = voteCount === 0;
        return (
          <Tooltip
            label={`${choice}: ${voteCount} votes (${votePercentage}%)`}
            key={choice}
          >
            <Box
              height="4px"
              borderRadius="2px"
              backgroundColor={
                noVotes || (onlyOneVote && isNoVote)
                  ? "#D7D7DB"
                  : colors[choice]
              }
              width={
                noVotes
                  ? `${100 / choices.length}%`
                  : onlyOneVote && isNoVote
                  ? "3px"
                  : `${votePercentage}%`
              }
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

const Post = ({ post }: any) => {
  return (
    <Flex flexDirection="column" flex={1} gap="6px" width={"100%"}>
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="400"
        color="#292932"
        width={"100%"}
      >
        {post.title}
      </Text>
      <Text
        color="#292932"
        variant="breadcrumbs"
        noOfLines={1}
        fontWeight="400"
      >
        <Box className="post-markdown">
          <MarkdownRenderer content={post.content ?? ""} />
        </Box>
      </Text>
    </Flex>
  );
};

export {
  Root,
  Status,
  Title,
  CustomDate,
  MutedText,
  Vote,
  PastVotes,
  CommentSummary,
  Comments,
  Container,
  DateRange,
  VoteResults,
  Post,
  CategoryText,
};
