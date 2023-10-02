import { Badge, Box, BoxProps, Flex, Icon, Tooltip } from "@chakra-ui/react";

import { Text } from "../Text";
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

type Props = BoxProps & {
  children?: React.ReactNode;
};

const cellPadding = {
  px: "standard.sm",
  py: "standard.base",
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
      py="standard.sm"
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

const Status = ({ status, width = "80", ...rest }: StatusProps) => {
  return (
    <Box
      minWidth={`${width}px`}
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
    <Box textTransform={"capitalize"} {...cellPadding} {...rest}>
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
    <Box textTransform={"uppercase"} minWidth="60px" {...cellPadding}>
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
    switch (votePreference) {
      case "for":
        return <VoteForIcon {...iconProps} color="green" />;
      case "against":
        return <VoteAgainstIcon {...iconProps} color="red" />;
      case "abstain":
        return <VoteAbstainIcon {...iconProps} color="black" />;
      default:
        return <VoteForIcon {...iconProps} color="green" />;
    }
  };
  const formatedVotes = formatVotesAmount(voteCount);
  return (
    <Flex
      pt="standard.base"
      flexDirection="column"
      flex={1}
      gap="standard.base"

      //       const cellPadding = {
      //   px: "standard.sm",
      //   py: "standard.base",
      // };
    >
      <Text
        variant="breadcrumbs"
        fontSize="12px"
        noOfLines={1}
        fontWeight="500"
        color="content.default.default"
      >
        {title}
      </Text>
      <Flex gap="standard.xs">
        <Text variant="small" fontWeight="500" color="content.support.default">
          Voted
          {renderIconBasedOnVotePreference()} with {formatedVotes} votes{" "}
        </Text>
        {body && (
          <Text color="content.default.default" variant="small">
            &quot;{body}&quot;
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

type CommentSummaryProps = {
  postTitle: string;
  comment: string;
  date: string;
};

const CommentSummary = ({ postTitle, comment, date }: CommentSummaryProps) => {
  console.log("Raw Date:", date);
  const formattedDate = date
    ? format(new Date(date), "d MMM yyyy")
    : "Unknown date";

  return (
    <Flex flexDirection="column" flex={1} gap="standard.base">
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

      <MarkdownRenderer
        textProps={{
          fontSize: "12px",
          noOfLines: 1,
          color: "content.default.default",
          fontWeight: "500",
        }}
        content={`&quot;${comment}&quot;` ?? ""}
      />
    </Flex>
  );
};

type CommentsProps = {
  count: number | null;
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
      {...cellPadding}
      {...rest}
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
  For: "surface.success.default",
  Against: "surface.danger.default",
  Abstain: "surface.accentSecondary.default",
  Yes: "surface.success.default",
  No: " surface.accentSecondary.default",
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
  return (
    <Box
      display="flex"
      flex="100%"
      maxWidth="108px"
      width="108px"
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
          <Tooltip
            label={`${choice}: ${voteCount} votes (${votePercentage}%)`}
            key={choice}
          >
            <Box
              height="4px"
              borderRadius="2px"
              backgroundColor={
                noVotes || (onlyOneVote && isNoVote)
                  ? "surface.onBg.default"
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
