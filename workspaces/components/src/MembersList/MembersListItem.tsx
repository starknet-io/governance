// WIP - Not in use yet

import { Box, IconButton } from "@chakra-ui/react";
import { MembersListItemProps } from "./types";
import { Username } from "../Username";
import { Text } from "../Text";
import { TrashIcon } from "../Icons";

export const MembersListItem = ({
  ../,
  displayName,
  address,
  index,
  totalMembers,
  miniBio,
  readonly,
}: MembersListItemProps) => {
  const isFirst = index === 0 || totalMembers === 1;
  const isLast = index === totalMembers - 1 || totalMembers === 1;
  return (
    <Box
      display="flex"
      alignItems="center"
      padding="4"
      borderTopLeftRadius={isFirst ? "xl" : "none"}
      borderTopRightRadius={isFirst ? "xl" : "none"}
      borderBottomLeftRadius={isLast ? "xl" : "none"}
      borderBottomRightRadius={isLast ? "xl" : "none"}
      _hover={{ bg: "gray.100" }}
    >
      <Box>
        <Username address={address} src={../} displayName={displayName} />
        {readonly ? null : (
          <IconButton
            aria-label="Delete member"
            icon={<TrashIcon cursor={"pointer"} />}
            variant="ghost"
            onClick={() => handleRemoveMember(index)}
          />
        )}
      </Box>

      <Text variant="large">{miniBio}</Text>
    </Box>
  );
};
