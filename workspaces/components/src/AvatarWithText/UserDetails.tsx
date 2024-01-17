import { Avatar, Box, Flex, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { Dropdown } from "src/Dropdown";
import { EllipsisIcon } from "src/Icons";
import { Tooltip } from "src/Tooltip";
import { Badge } from "src/Badge";
import { truncateAddress } from "src/utils";
import { CopyToClipboard } from "../CopyToClipboard";
import { navigate } from "vite-plugin-ssr/client/router";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";

export const UserDetails = ({user}: any) => {
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <g clipPath="url(#clip0_6206_15780)">
                    <g clipPath="url(#clip1_6206_15780)">
                    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#6279F8"/>
                    <path d="M16.498 4V12.8698L23.9948 16.2199L16.498 4Z" fill="#C8D0FF"/>
                    <path d="M16.4981 4L9 16.2199L16.4981 12.8698V4Z" fill="white"/>
                    <path d="M16.498 21.9679V27.995L24.0001 17.6157L16.498 21.9679Z" fill="#C6CFFF"/>
                    <path d="M16.4981 27.995V21.9671L9 17.6157L16.4981 27.995Z" fill="white"/>
                    <path d="M16.498 20.5731L23.9948 16.22L16.498 12.8721V20.5731Z" fill="#8296F8"/>
                    <path d="M9 16.22L16.4981 20.5731V12.8721L9 16.22Z" fill="#C6CFFF"/>
                    </g>
                    </g>
                    <defs>
                    <clipPath id="clip0_6206_15780">
                    <rect width="32" height="32" fill="white"/>
                    </clipPath>
                    <clipPath id="clip1_6206_15780">
                    <rect width="32" height="32" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
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
                  <svg
                    width="38px"
                    height="38px"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.87292e-06 19C1.87292e-06 29.4935 8.50636 38 18.9997 38C29.4931 38 38 29.4935 38 19C38 8.50648 29.4931 0 18.9997 0C8.50636 0 1.87292e-06 8.50648 1.87292e-06 19Z"
                      fill="#0C0C4F"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M33.6343 13.6804C33.034 13.0092 32.0971 12.6312 31.1863 12.4762C30.2682 12.3274 29.3056 12.3412 28.3992 12.5022C26.5654 12.8124 24.8994 13.5718 23.4464 14.5085C22.6918 14.9683 22.0483 15.5002 21.3816 16.042C21.0604 16.316 20.7675 16.6078 20.4625 16.8954L19.6291 17.7246C18.7235 18.6712 17.831 19.5334 16.9674 20.248C16.1003 20.9593 15.2896 21.4996 14.4907 21.8769C13.6923 22.2561 12.838 22.4791 11.7244 22.5148C10.6207 22.5538 9.31485 22.3546 7.91803 22.0257C6.51371 21.6984 5.03903 21.2318 3.39111 20.8303C3.96611 22.4255 4.83199 23.8352 5.94368 25.1238C7.0684 26.3901 8.47285 27.5442 10.277 28.3032C12.0552 29.0791 14.2897 29.3575 16.3791 28.9374C18.474 28.5342 20.3124 27.5648 21.7984 26.4437C23.2882 25.311 24.4935 24.0209 25.5096 22.6796C25.7902 22.309 25.9385 22.1016 26.1415 21.812L26.7025 20.9809C27.0924 20.4668 27.4473 19.8815 27.8333 19.3722C28.5899 18.3055 29.3358 17.24 30.2027 16.2584C30.639 15.7605 31.0989 15.2843 31.6421 14.8266C31.913 14.6032 32.2057 14.3846 32.5298 14.1877C32.8589 13.9753 33.2064 13.809 33.6343 13.6804Z"
                      fill="url(#paint0_linear_746_37556)"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M26.4751 27.201C26.4751 28.3962 27.4445 29.3656 28.6397 29.3656C29.8348 29.3656 30.803 28.3962 30.803 27.201C30.803 26.0058 29.8348 25.0364 28.6397 25.0364C27.4445 25.0364 26.4751 26.0058 26.4751 27.201Z"
                      fill="#EC796B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M33.6343 13.6804C32.9893 12.0532 31.7905 10.6833 30.1814 9.67255C28.582 8.67286 26.3605 8.16267 24.1593 8.59757C23.0718 8.80789 22.0183 9.21281 21.0937 9.75205C20.1733 10.2891 19.3486 10.9357 18.6346 11.6293C18.2782 11.9772 17.9546 12.3402 17.6332 12.7053L16.8002 13.7674L15.5135 15.4771C13.8731 17.6769 12.1067 20.255 9.20798 21.0189C6.36221 21.7688 5.12796 21.1046 3.39111 20.8302C3.70869 21.6502 4.10208 22.4464 4.63538 23.1469C5.15874 23.8616 5.77692 24.5329 6.54549 25.1083C6.93389 25.3846 7.34395 25.6573 7.79938 25.8887C8.25274 26.1121 8.74165 26.3089 9.26351 26.4569C10.3015 26.7415 11.4702 26.8411 12.6017 26.6881C13.7337 26.537 14.8158 26.1783 15.7616 25.7018C16.7144 25.2298 17.5443 24.655 18.2855 24.0484C19.7587 22.8249 20.9046 21.4731 21.8726 20.1067C22.3595 19.4235 22.8014 18.7274 23.2102 18.0311L23.6912 17.2022C23.8383 16.9599 23.9871 16.7161 24.1381 16.489C24.7477 15.5768 25.3439 14.8453 26.0681 14.2963C26.7823 13.733 27.7766 13.3169 29.1055 13.2202C30.4288 13.1224 31.9565 13.3031 33.6343 13.6804Z"
                      fill="#FAFAFA"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.6192 14.5239L11.0882 13.0748C11.1836 12.7801 11.4162 12.5508 11.712 12.4603L13.1681 12.0126C13.3696 11.951 13.3713 11.6666 13.1713 11.6018L11.7218 11.1328C11.4276 11.0375 11.1983 10.8049 11.1073 10.5091L10.6601 9.05294C10.5985 8.85193 10.3142 8.84975 10.2493 9.05022L9.78032 10.4992C9.685 10.7934 9.45239 11.0228 9.1566 11.1137L7.7005 11.561C7.49895 11.6231 7.49677 11.9069 7.69724 11.9717L9.14679 12.4407C9.44095 12.5361 9.67029 12.7692 9.76126 13.065L10.2085 14.5206C10.27 14.7221 10.5544 14.7243 10.6192 14.5239Z"
                      fill="#FAFAFA"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_746_37556"
                        x1="3.40181"
                        y1="14.9087"
                        x2="57.4978"
                        y2="23.9363"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#EC796B" />
                        <stop offset="1" stopColor="#D672EF" />
                      </linearGradient>
                    </defs>
                  </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.58333 2.16699C8.30249 2.16699 7.5721 3.17908 7.24585 3.83158C7.00468 4.31392 6.674 5.31655 6.41956 6.13075C6.29802 6.51967 6.18784 6.88568 6.10447 7.16693H3.69792C2.62211 7.16693 1.75 8.03904 1.75 9.11484V16.3023C1.75 17.3782 2.62211 18.2503 3.69792 18.2503H14.7384C16.1819 18.2503 17.4402 17.2678 17.7903 15.8674L18.9882 11.0757C19.2232 10.1359 19.012 9.14032 18.4159 8.37678C17.8197 7.61323 16.905 7.16693 15.9363 7.16693H12.8333V5.4387C12.8333 4.50323 12.2328 3.68614 11.651 3.156C11.3447 2.87686 11.0032 2.63889 10.6654 2.46715C10.3418 2.30264 9.95913 2.16699 9.58333 2.16699ZM5.91666 8.66693H3.69792C3.45054 8.66693 3.25 8.86747 3.25 9.11484V16.3023C3.25 16.5497 3.45054 16.7503 3.69792 16.7503H5.91666V8.66693ZM7.41666 16.7503H14.7384C15.4936 16.7503 16.1519 16.2363 16.3351 15.5036L17.533 10.7119C17.6559 10.2203 17.5455 9.69936 17.2336 9.29989C16.9217 8.90042 16.4431 8.66693 15.9363 8.66693H12.0833C11.6691 8.66693 11.3333 8.33114 11.3333 7.91693V7.91591V5.4387C11.3333 5.12754 11.1006 4.68379 10.6407 4.26473C10.4262 4.06927 10.1947 3.91055 9.98562 3.80426C9.76232 3.69073 9.62421 3.66699 9.58333 3.66699C9.19751 3.66699 8.84956 3.97826 8.58749 4.5024C8.41199 4.8534 8.11767 5.72574 7.85128 6.57817C7.72256 6.99004 7.60655 7.37673 7.52265 7.6607C7.48073 7.80257 7.4469 7.91854 7.42361 7.99887L7.41666 8.02292V16.7503Z"
                fill="#4A4A4F"
              />
            </svg>
            <Text variant="small" color="content.accent.default">
              {user?.likes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.09573 1.75C4.65221 1.75 3.39393 2.73244 3.04382 4.13286L1.84591 8.92452C1.61096 9.86431 1.82209 10.8599 2.41825 11.6235C3.01441 12.387 3.9291 12.8333 4.89782 12.8333H8.0008V14.5616C8.0008 16.1287 8.99682 17.5227 10.4795 18.0304L10.8045 18.1417C11.3084 18.3143 11.8604 18.2788 12.338 18.0429C12.8156 17.807 13.1794 17.3904 13.3488 16.8853L14.7071 12.8333H17.1362C18.212 12.8333 19.0841 11.9612 19.0841 10.8854V3.69792C19.0841 2.62211 18.212 1.75 17.1362 1.75H14.1675H6.09573ZM13.4175 3.25H6.09573C5.34051 3.25 4.68221 3.76399 4.49904 4.49666L3.30112 9.28833C3.1782 9.78001 3.28866 10.3009 3.60056 10.7004C3.91246 11.0998 4.39101 11.3333 4.89782 11.3333H8.7508C9.16501 11.3333 9.5008 11.6691 9.5008 12.0833V12.0844V14.5616C9.5008 15.4876 10.0894 16.3113 10.9655 16.6114L10.9655 16.6114L11.2905 16.7227C11.4165 16.7658 11.5544 16.7569 11.6739 16.6979C11.7933 16.639 11.8842 16.5348 11.9265 16.4085L13.4175 11.9609V3.25ZM14.9175 11.3333V3.25H17.1362C17.3836 3.25 17.5841 3.45054 17.5841 3.69792V10.8854C17.5841 11.1328 17.3836 11.3333 17.1362 11.3333H14.9175Z"
                fill="#4A4A4F"
              />
            </svg>
            <Text variant="small" color="content.accent.default">
              {user?.dislikes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 1.75C5.44995 1.75 1.75 5.44995 1.75 10C1.75 14.55 5.44995 18.25 10 18.25C14.5501 18.25 18.25 14.5492 18.25 10C18.25 5.45079 14.5492 1.75 10 1.75ZM3.25 10C3.25 6.27838 6.27838 3.25 10 3.25C13.7208 3.25 16.75 6.27921 16.75 10C16.75 13.7208 13.7216 16.75 10 16.75C6.27838 16.75 3.25 13.7216 3.25 10ZM7.5 11.75C7.08579 11.75 6.75 12.0858 6.75 12.5C6.75 12.9142 7.08579 13.25 7.5 13.25H12.5C12.9142 13.25 13.25 12.9142 13.25 12.5C13.25 12.0858 12.9142 11.75 12.5 11.75H7.5ZM7.08333 6.75C7.49755 6.75 7.83333 7.08579 7.83333 7.5V8.33333C7.83333 8.74755 7.49755 9.08333 7.08333 9.08333C6.66912 9.08333 6.33333 8.74755 6.33333 8.33333V7.5C6.33333 7.08579 6.66912 6.75 7.08333 6.75ZM13.6667 7.5C13.6667 7.08579 13.3309 6.75 12.9167 6.75C12.5025 6.75 12.1667 7.08579 12.1667 7.5V8.33333C12.1667 8.74755 12.5025 9.08333 12.9167 9.08333C13.3309 9.08333 13.6667 8.74755 13.6667 8.33333V7.5Z"
                fill="#4A4A4F"
              />
            </svg>
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
