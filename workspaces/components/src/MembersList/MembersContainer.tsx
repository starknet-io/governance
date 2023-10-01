// WIP - Not in use yet
import { Box } from "@chakra-ui/react";
import { MembersListItem } from "./MembersListItem";
import { MembersListProps } from "./types";

const MembersList: React.FC<MembersListProps> = ({ members }) => {
  return (
    <Box>
      {members.map((member, index) => (
        <MembersListItem
          key={member.address}
          {...member}
          index={index}
          totalMembers={members.length}
        />
      ))}
    </Box>
  );
};
