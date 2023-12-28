import { Badge, Box, BoxProps, Flex, Icon } from "@chakra-ui/react";

import { Text } from "../Text";
import { Heading } from "../Heading";
import {
  format,
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
import { formatVotesAmount } from "src/utils";
import { Tooltip } from "src/Tooltip";

type Props = BoxProps & {
  children?: React.ReactNode;
};

const cellPadding = {
  px: "standard.sm",
  py: "standard.base",
};
const Container = ({ children, ...rest }: Props) => {
  return (
    <Box mt="standard.xs" display="flex" flexDirection="column" {...rest}>
      {children}
    </Box>
  );
};

type RootProps = {
  children: React.ReactNode;
  href?: string;
} & BoxProps;

const Root = ({ children, href, sx, ...rest }: RootProps) => {
  return (
    <Box
      as="a"
      href={href}
      display="flex"
      flexDirection="row"
      // gap="32px"
      borderBottom="1px solid"
      borderColor="border.forms"
      // minHeight="68px"
      py="standard.base"
      px="0"
      alignItems="center"
      _hover={{
        textDecoration: "none",
        backgroundColor: "surface.forms.hover",
      }}
      width={"100%"}
      {...rest}
    >
      {children}
    </Box>
  );
};

type StatusProps = {
  status: string | null | undefined;
  width?: string | null;
} & BoxProps;

const Status = ({ status, ...rest }: StatusProps) => {
  return (
    <Box
      w="100px"
      mx={{
        md: "auto",
      }}
      justifyContent="flex-end"
      display="flex"
      {...cellPadding}
      {...rest}
    >
      <Badge variant={status ?? "outline"}>{status}</Badge>
    </Box>
  );
};

type TitleProps = {
  label: string | null | undefined;
} & BoxProps;

const Title = ({ label = "", ...rest }: TitleProps) => {
  return (
    <Box flex="1" {...cellPadding} {...rest}>
      <Heading variant="h5" noOfLines={1} color="content.default.default">
        {label}
      </Heading>
    </Box>
  );
};

// type DateProps = {
//   label?: string | null;
// };

const CustomDate = () => {
  return (
    <Box {...cellPadding}>
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
    <Box textTransform={"uppercase"} minWidth="60px" {...cellPadding}>
      <Text variant="breadcrumbs" color="#6B7280">
        {type === "snip" ? "SNIP" : "Vote"} {id.toString().padStart(3, "0")}
      </Text>
    </Box>
  );
};

type CategoryProps = {
  category: string;
} & BoxProps;

const CategoryText = ({ category, ...rest }: CategoryProps) => {
  return (
    <Box textTransform={"capitalize"} minW="132px" {...cellPadding} {...rest}>
      <Text variant="bodySmall" fontWeight={500} color="#6B7280">
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
    <Box textTransform={"uppercase"} minWidth="60px" {...cellPadding}>
      Vote status
    </Box>
  );
};

type PastVotesProps = {
  title?: string | null;
  body?: string | null;
  voteCount?: number | null;
  votePreference?:
    | "for"
    | "against"
    | "abstain"
    | "Yes, More TPS Daddy 👉👈"
    | "No, Less TPS Daddy 😔"
    | "most aligned 🧭📈"
    | "least aligned🧭📉"
    | "starknet is ethereum";
};

const PastVotes = ({
  title = "",
  voteCount,
  votePreference,
  body,
}: PastVotesProps) => {
  const iconProps = {
    mr: "4px",
    ml: "4px",
    boxSize: "16px",
    mt: "-2px",
  };
  const renderIconBasedOnVotePreference = () => {
    console.log("vote preference ", votePreference);
    switch (votePreference) {
      case "for":
        return <VoteForIcon {...iconProps} boxSize="18px" color="#30B37C" />;
      case "Yes, More TPS Daddy 👉👈":
        return <VoteForIcon {...iconProps} boxSize="18px" color="#30B37C" />;
      case "most aligned 🧭📈":
        return <VoteForIcon {...iconProps} boxSize="18px" color="#30B37C" />;
      case "against":
        return (
          <VoteAgainstIcon {...iconProps} boxSize="18px" color="#EC796B" />
        );
      case "least aligned🧭📉":
        return (
          <VoteAgainstIcon {...iconProps} boxSize="18px" color="#EC796B" />
        );
      case "No, Less TPS Daddy 😔":
        return (
          <VoteAgainstIcon {...iconProps} boxSize="18px" color="#EC796B" />
        );
      case "starknet is ethereum":
        return (
          <VoteAbstainIcon {...iconProps} boxSize="18px" color="#4A4A4F" />
        );
      case "abstain":
        return (
          <VoteAbstainIcon {...iconProps} boxSize="18px" color="#4A4A4F" />
        );
      default:
        return <VoteForIcon {...iconProps} boxSize="18px" color="#30B37C" />;
    }
  };
  const formatedVotes = formatVotesAmount(voteCount);

  return (
    <Flex
      // pt="standard.base"
      flexDirection="column"
      flex={1}
      gap="standard.base"
      {...cellPadding}

      //       const cellPadding = {
      //   px: "standard.sm",
      //   py: "standard.base",
      // };
    >
      <Text
        variant="mediumStrong"
        noOfLines={1}
        fontWeight="500"
        color="content.default.default"
      >
        {title}
      </Text>
      <Flex gap="standard.xs">
        <Flex flexShrink={0}>
          <Text
            variant="small"
            fontWeight="500"
            color="content.support.default"
            display="flex"
            alignItems={"center"}
            gap={"standard.xxs"}
            pt="standard.base"
            pr="standard.xs"
            pb="standard.base"
          >
            Voted{renderIconBasedOnVotePreference()}with {formatedVotes} votes
          </Text>
        </Flex>
        {body && (
          <Box>
            <Text color="content.support.default" variant="small" noOfLines={1}>
              &quot;{body}&quot;
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

type CommentsProps = {
  count?: number;
  width?: string | null;
} & BoxProps;

const Comments = ({ count, width, ...rest }: CommentsProps) => {
  return (
    <Box
      minWidth={`${width}px`}
      display="flex"
      flexDirection="row"
      gap="4px"
      alignItems="center"
      color="content.support.default"
      minW={{
        md: "64px",
      }}
      pt="standard.xs"
      pl="standard.sm"
      pb="standard.xs"
      {...rest}
    >
      <Icon
        as={() => (
          <CommentIcon color="currentColor" width="20px" height="20px" />
        )}
      />
      <Text variant="bodySmall" fontWeight={500}>
        {count}
      </Text>
    </Box>
  );
};

type CommentSummaryProps = {
  postTitle: string;
  comment: string;
  date: string;
} & CommentsProps;

const CommentSummary = ({
  postTitle,
  comment,
  date,
  count,
}: CommentSummaryProps) => {
  const formattedDate = date
    ? format(new Date(date), "d MMM yyyy")
    : "Unknown date";

  return (
    <Flex flexDirection="row" flex={1} alignItems="end" width="100%">
      <Flex
        flexDirection="column"
        gap="standard.base"
        pt="standard.xs"
        pr="standard.sm"
        pb="standard.xs"
        width="calc(100% - 64px)"
      >
        <Box flex="1">
          <Text
            variant="mediumStrong"
            noOfLines={1}
            color="content.default.default"
            sx={{
              _firstLetter: {
                textTransform: "uppercase",
              },
            }}
          >
            {postTitle} on {formattedDate ?? ""}
          </Text>
        </Box>

        <Flex flex={1}>
          <Box height="20px" overflow="hidden">
            <MarkdownRenderer
              textProps={{
                fontSize: "12px",
                noOfLines: 1,
                color: "content.support.default",
                fontWeight: "500",
              }}
              content={`&quot;${comment}&quot;` ?? ""}
            />
          </Box>
        </Flex>
      </Flex>
      {count ? (
        <Box ml="auto">
          <Comments width={"52"} count={count} />
        </Box>
      ) : null}
    </Flex>
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
} & BoxProps;

const DateRange = ({ start, end, state, ...rest }: DateRangeProps) => {
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
    <Box width="calc(120px + 24px)" {...cellPadding} {...rest}>
      <Text
        variant="bodySmall"
        fontWeight={500}
        letterSpacing="0.12px"
        noOfLines={1}
        color="#6C6C7A"
      >
        {dateText}
      </Text>
    </Box>
  );
};

const colors: { [key: string]: string } = {
  For: "surface.success.default",
  Against: "surface.danger.default",
  Abstain: "surface.accentSecondary.default",
  Yes: "surface.success.default",
  No: "surface.danger.default",
  "most aligned 🧭📈": "surface.success.default",
  "least aligned🧭📉": "surface.danger.default",
  "starknet is ethereum": "surface.accentSecondary.default",
  0: "surface.success.default",
  1: "surface.danger.default",
  2: "surface.accentSecondary.default",
};

interface VoteResultsProps extends BoxProps {
  choices: string[];
  scores: number[];
}

const VoteResults: React.FC<VoteResultsProps> = ({
  choices,
  scores,
  ...rest
}) => {
  const total = scores.reduce((a, b) => a + b, 0);
  const noVotes = total === 0;
  const onlyOneVote = total === Math.max(...scores);
  const getColorForKey = (choice: string, i: number): string => {
    const key = choice.split(",")[0].trim(); // Extracts the first word before a comma
    return colors[key] || colors[i] || "surface.onBg.default"; // Fallback color
  };
  const toolTipContent = choices
    .map((choice, i) => {
      const rawVotePercentage = (scores[i] / total) * 100;
      const votePercentage = isNaN(rawVotePercentage)
        ? 0
        : rawVotePercentage.toFixed(2);
      const voteCount = scores[i] || 0;
      return `${choice}: ${voteCount} votes (${votePercentage}%)`;
    })
    .join("\n");

  return (
    <Tooltip label={toolTipContent}>
      <Box
        display="flex"
        flex="100%"
        maxWidth="200px"
        width="200px"
        gap="2px"
        overflow="hidden"
        {...cellPadding}
        {...rest}
      >
        {choices.map((choice, i) => {
          const rawVotePercentage = (scores[i] / total) * 100;
          const votePercentage = isNaN(rawVotePercentage)
            ? 0
            : rawVotePercentage.toFixed(2);
          const voteCount = scores[i] || 0;
          const isNoVote = voteCount === 0;
          return (
            <Box
              key={choice}
              height="4px"
              borderRadius="2px"
              backgroundColor={
                noVotes || (onlyOneVote && isNoVote)
                  ? "surface.onBg.default"
                  : getColorForKey(choice)
              }
              width={
                noVotes
                  ? `${100 / choices.length}%`
                  : onlyOneVote && isNoVote
                  ? "3px"
                  : `${votePercentage}%`
              }
            />
          );
        })}
      </Box>
    </Tooltip>
  );
};

const Post = ({ post }: any) => {
  return (
    <Flex
      flexDirection="column"
      flex={1}
      gap="6px"
      width={"100%"}
      {...cellPadding}
    >
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
