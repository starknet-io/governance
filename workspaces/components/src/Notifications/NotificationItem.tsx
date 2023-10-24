import { truncateAddress } from "../utils";
import { MenuItem, Text } from "../../index";
import { Flex, Icon } from "@chakra-ui/react";
import { Indenticon } from "../Indenticon";
import { NotificationVotingProposalIcon } from "../Icons";

export const NotificationItem = ({ notification }: { notification: any }) => {
  const formattedAddress =
    notification?.user?.ensName || truncateAddress(notification?.user?.address);
  return (
    <MenuItem maxW={"400px"} pt={3} pb={3} key={notification.id}>
      <Flex gap={2} justifyContent="space-between">
        <Flex direction="column" alignItems="center" gap={2}>
          <Indenticon size={40} address={notification?.user?.address} />
          <Icon as={NotificationVotingProposalIcon} boxSize="5" />
        </Flex>
        <Flex direction="column" justifyContent="space-between">
          <Flex gap={2}>
            <Text>{formattedAddress}</Text>
            <Text color="grey">{notification.type}</Text>
          </Flex>
          <Flex className="break-all">{notification.title}</Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          a
        </Flex>
      </Flex>
    </MenuItem>
  );
};
