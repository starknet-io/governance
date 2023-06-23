import React from "react";
import { Comment } from "@yukilabs/governance-backend/src/db/schema/comments";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { QuillEditor } from "src/Editor";
import { Box, Flex, Text } from "@chakra-ui/react";
import { truncateAddress } from "src/utils";
import { Indenticon } from "../Indenticon";

type CommentWithAuthor = Comment & {
  author: User | null;
};

type CommentListProps = {
  commentsList: CommentWithAuthor[];
};

function daysAgo(date: Date): string {
  const now = new Date();
  const differenceInMs = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays > 0) {
    return `${differenceInDays}d`;
  } else {
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
    return `${differenceInHours}h`;
  }
}

export const CommentList: React.FC<CommentListProps> = ({ commentsList }) => {
  console.log("commentsList: ", commentsList);

  return (
    <Box className="comment-list">
      {commentsList.map((comment, index) => {
        const { author, createdAt, content } = comment;
        return (
          <Flex key={index} display="flex" marginBottom="16px">
            <Box paddingRight="16px">
              <Indenticon size={40} address={author?.address || ""} />
            </Box>
            <Box>
              <Flex>
                <Text fontWeight="bold" fontSize="14px">
                  {truncateAddress(author ? author.address : "")}
                </Text>
                <Text
                  fontSize="12px"
                  color="#6C6C75"
                  fontWeight="bold"
                  paddingLeft="6px"
                  paddingTop="2px"
                >
                  {daysAgo(createdAt)}
                </Text>
              </Flex>
              <QuillEditor value={content || ""} readOnly={true} />
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};
