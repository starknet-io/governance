import { Avatar, Box, Flex, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { truncateAddress } from "src/utils";
import { navigate } from "vite-plugin-ssr/client/router";
import { EthereumIcon, StarknetIcon, LikeIcon, DislikeIcon, ReactionIcon } from "src/Icons/UiIcons";

export const UserDetails = ({user}: any) => {
  console.log('user ', user)
  return (
    <Flex gap="standard.sm" direction="column">
      <Flex gap="standard.sm" alignItems="center">
        <Box>
          {user?.avatarSrc !== null ? (
            <Avatar size="lg" sx={{ width: "56px", height: "56px" }} src={user?.avatarSrc} />
          ) : (
            <Indenticon size={56} address={user?.address} />
          )}
        </Box>
        <Box
          position="relative"
          justifyContent={"space-between"}
          flex={1}
          gap="0"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="100%"
        >
          <Box>
            <Heading
              variant="h4"
              height="24px"
              style={{
                width: "90%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer"
              }}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/profile/${user?.address}`)
              }}
            >{user?.username || user?.ensName}</Heading>
            <Flex alignItems="center" gap="standard.sm" alignSelf="stretch">
              <Flex direction="row" gap="standard.base">
                <Box
                  width="20px"
                  height="20px"
                  sx={{
                    "& svg": {
                      width: "20px",
                      height: "20px"
                    }
                  }}
                >
                  <EthereumIcon />
                </Box><Text variant="smallStrong">{truncateAddress(user.address || "").toLowerCase()}</Text>
              </Flex>
              {user.starknetAddress ? <Flex direction="row" gap="standard.base">
                <Box
                  width="20px"
                  height="20px"
                  sx={{
                    "& svg": {
                      width: "20px",
                      height: "20px"
                    }
                  }}
                >
                  <StarknetIcon />
                </Box><Text variant="smallStrong">{truncateAddress(user.starknetAddress || "").toLowerCase()}</Text>
              </Flex> : null}
            </Flex>
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="flex-start" alignSelf="stretch">
        <Flex alignItems="flex-start" direction="row" gap="standard.base">
          <Text variant="small" color="content.support.default">
            Proposals voted on
          </Text>
          <Text variant="smallStrong" color="content.default.default">{user.votingPower || 0}</Text>
        </Flex>
        <Flex alignItems="flex-start" direction="row" gap="standard.base">
          <Text variant="small" color="content.support.default">
            Total comments
          </Text>
          <Text variant="smallStrong">{user.totalComments || 0}</Text>
        </Flex>
      </Flex>
      <Flex alignSelf="stretch" alignItems="center" direction="row">
        <Text variant="small" color="content.default.default" sx={{minWidth: "50%"}}>
          Votes breakdown
        </Text>
        <Flex
          justifyContent="space-between"
          flexDirection="row"
          width="100%"
        >
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <LikeIcon />
            <Text variant="small" color="content.accent.default">
              {user?.likes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <DislikeIcon />
            <Text variant="small" color="content.accent.default">
              {user?.dislikes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <ReactionIcon />
            <Text variant="small" color="content.accent.default">
              {user?.comments ?? 0}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UserDetails;
