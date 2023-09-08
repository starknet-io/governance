import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Tooltip,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { Tag } from "../Tag";
import { Button } from "../Button";
import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
import { MarkdownRenderer } from "src/MarkdownRenderer";

export type DelegateCardProps = {
  statement: string | null;
  type: string[];
  votingPower: number;
  voteCount: number;
  onDelegateClick?: () => void;
  profileURL?: string;
  address: string | null | undefined;
  ensName?: string | null;
  ensAvatar?: string | null;
};

const delegateNames: Record<string, string> = {
  cairo_dev: "Cairo Dev",
  daos: "DAOs",
  governance: "Governance",
  identity: "Identity",
  infrastructure: "Infrastructure",
  infrastructure_starknet_dev: "Infrastructure Starknet dev",
  legal: "Legal",
  professional_delegate: "Professional delegate",
  security: "Security",
  starknet_community: "Starknet community",
  web3_community: "Web3 community",
  web3_developer: "Web3 developer",
};

function extractParagraph(markdownContent: string, charLimit = 300): string {
  // Remove headings
  const noHeadings = markdownContent.replace(/#+ .+\n/g, "").trim();

  const firstParagraphMatch = noHeadings.match(/(?:\n|^)([^#].+?)(?:\n|$)/);
  if (firstParagraphMatch && firstParagraphMatch[1]) {
    const firstParagraph = firstParagraphMatch[1];
    return firstParagraph.substring(0, charLimit);
  }
  return "";
}
const DelegateTags = ({ type }: { type: string[] }) => {
  if (!Array.isArray(type) || type.length === 0) return null;

  const renderTags = (startIndex: number, endIndex: number) =>
    type.slice(startIndex, endIndex).map((item: string) => (
      <Tag style={{ pointerEvents: "none" }} key={item}>
        {delegateNames?.[item] ?? item}
      </Tag>
    ));

  const renderTooltip = (startIndex: number) => (
    <Tooltip
      hasArrow
      shouldWrapChildren
      placement="top"
      label={type
        .slice(startIndex)
        .map((t) => delegateNames?.[t] ?? t)
        .join(", ")}
    >
      <Tag variant="review">+{type.length - startIndex}</Tag>
    </Tooltip>
  );

  return (
    <Box display="flex" flexDirection="row" gap="8px" mb="12px">
      {type[0].length > 20 ? (
        <>
          {renderTags(0, 1)}
          {type.length > 1 && renderTooltip(1)}
        </>
      ) : (
        <>
          {renderTags(0, 2)}
          {type.length > 2 && renderTooltip(2)}
        </>
      )}
    </Box>
  );
};

export const DelegateCard = ({
  statement,
  type,
  votingPower,
  ensAvatar,
  address,
  ensName,
  onDelegateClick,
  profileURL,
}: DelegateCardProps) => {
  const votesFormatted = votingPower
    ? `${votingPower} delegated votes`
    : "0 delegated votes";
  const formattedDelegateStatement = extractParagraph(statement || "");

  return (
    <LinkBox as={Card} variant="delegate">
      <CardHeader>
        <LinkOverlay href={profileURL}>
          <ProfileSummaryCard.Root>
            <ProfileSummaryCard.Profile
              imgUrl={ensAvatar}
              size="sm"
              address={address}
              ensName={ensName}
              subtitle={votesFormatted.toUpperCase()}
              avatarString={address}
            />
          </ProfileSummaryCard.Root>
        </LinkOverlay>
      </CardHeader>
      <CardBody>
        <DelegateTags type={type} />
        <MarkdownRenderer
          textProps={{ fontSize: "14px", noOfLines: 3, color: "#4A4A4F" }}
          content={formattedDelegateStatement || ""}
        />
      </CardBody>
      <CardFooter>
        <Box width="100%" display="flex" flexDirection="column" gap="16px">
          <Box>
            <Button
              size="condensed"
              variant="outline"
              onClick={onDelegateClick}
            >
              Delegate
            </Button>
          </Box>
        </Box>
      </CardFooter>
    </LinkBox>
  );
};

// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Box,
//   Tooltip,
//   LinkBox,
//   LinkOverlay,
// } from "@chakra-ui/react";
// import { Tag } from "../Tag";
// import { Button } from "../Button";
// import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
// import { MarkdownRenderer } from "src/MarkdownRenderer";

// type APIAuthorProps = {
//   id?: string;
//   address?: string | null;
//   ensName?: string | null;
//   ensAvatar?: string | null;
// };

// type APIVotingInfoProps = {
//   votingPower: number;
// };

// type APIDelegateProps = {
//   statement: string | null;
//   type: string[];
//   author: APIAuthorProps;
//   votingInfo: APIVotingInfoProps;
// };

// type DelegateCardProps = APIDelegateProps & {
//   onDelegateClick?: () => void;
//   profileURL?: string;
// };

// function extractParagraph(markdownContent: string, charLimit = 300): string {
//   // Remove headings
//   const noHeadings = markdownContent.replace(/#+ .+\n/g, "").trim();

//   const firstParagraphMatch = noHeadings.match(/(?:\n|^)([^#].+?)(?:\n|$)/);
//   if (firstParagraphMatch && firstParagraphMatch[1]) {
//     const firstParagraph = firstParagraphMatch[1];
//     return firstParagraph.substring(0, charLimit);
//   }
//   return "";
// }

// export const delegateNames: Record<string, string> = {
//   cairo_dev: "Cairo Dev",
//   daos: "DAOs",
//   governance: "Governance",
//   identity: "Identity",
//   infrastructure: "Infrastructure",
//   infrastructure_starknet_dev: "Infrastructure Starknet dev",
//   legal: "Legal",
//   professional_delegate: "Professional delegate",
//   security: "Security",
//   starknet_community: "Starknet community",
//   web3_community: "Web3 community",
//   web3_developer: "Web3 developer",
// };

// export const DelegateCard = (props: DelegateCardProps) => {
//   const { onDelegateClick, profileURL, votingInfo, author, type, statement } =
//     props;
//   const votesFormatted = votingInfo
//     ? `${votingInfo.votingPower} delegated votes`
//     : "0 delegated votes";
//   const formattedDelegateStatement = extractParagraph(statement || "");
//   return (
//     <LinkBox as={Card} variant="delegate">
//       <CardHeader>
//         <LinkOverlay href={profileURL}>
//           <ProfileSummaryCard.Root>
//             <ProfileSummaryCard.Profile
//               imgUrl={author?.ensAvatar}
//               size="sm"
//               address={author?.address}
//               ensName={author?.ensName}
//               subtitle={votesFormatted.toUpperCase()}
//               avatarString={author?.address}
//             />
//           </ProfileSummaryCard.Root>
//         </LinkOverlay>
//       </CardHeader>
//       <CardBody>
//         <Box display="flex" flexDirection="row" gap="8px" mb="12px">
//           {Array.isArray(type) && type.length > 0 ? (
//             <>
//               {type[0].length > 20 ? (
//                 <>
//                   <Tag style={{ pointerEvents: "none" }} key={type[0]}>
//                     {delegateNames?.[type[0]] ?? type[0]}
//                   </Tag>
//                   {type.length > 1 && (
//                     <Tooltip
//                       hasArrow
//                       shouldWrapChildren
//                       placement="top"
//                       label={type
//                         .slice(1)
//                         .map((t) => delegateNames?.[t] ?? t)
//                         .join(", ")}
//                     >
//                       <Tag variant="amount">+{type.length - 1}</Tag>
//                     </Tooltip>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   {type.slice(0, 2).map((item: string) => (
//                     <Tag style={{ pointerEvents: "none" }} key={item}>
//                       {delegateNames?.[item] ?? item}
//                     </Tag>
//                   ))}
//                   {type.length > 2 && (
//                     <Tooltip
//                       hasArrow
//                       shouldWrapChildren
//                       placement="top"
//                       label={type
//                         .slice(2)
//                         .map((t) => delegateNames?.[t] ?? t)
//                         .join(", ")}
//                     >
//                       <Tag variant="amount">+{type.length - 2}</Tag>
//                     </Tooltip>
//                   )}
//                 </>
//               )}
//             </>
//           ) : (
//             <></>
//           )}
//         </Box>

//         <MarkdownRenderer
//           textProps={{ fontSize: "14px", noOfLines: 3, color: "#4A4A4F" }}
//           content={formattedDelegateStatement || ""}
//         />
//       </CardBody>
//       <CardFooter>
//         <Box width="100%" display="flex" flexDirection="column" gap="16px">
//           <Box>
//             <Button
//               size="condensed"
//               variant="outline"
//               onClick={onDelegateClick}
//             >
//               Delegate
//             </Button>
//           </Box>
//         </Box>
//       </CardFooter>
//     </LinkBox>
//   );
// };
