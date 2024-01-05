import { Box, Flex, MenuItem, VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { AvatarWithText } from "./AvatarWithText";
import { ThemeProvider } from "../ThemeProvider";
import { formatVotesAmount, truncateAddress } from "..//utils";
import { Button } from "..//Button";
import { Banner } from "..//Banner/Banner";
import * as SummaryItems from "..//SummaryItems/SummaryItems";

export default {
  title: "governance-ui/AvatarWithText",
  component: AvatarWithText,
} as Meta<typeof AvatarWithText>;

export const Default = () => (
  <ThemeProvider>
    <Box>
      <VStack
        p={12}
        spacing={"22px"}
        align={"flex-start"}
        border="1px solid #eee"
        padding="standard.lg"
        width={"100%"}
        maxWidth="380px"
      >
        <AvatarWithText
          size="condensed"
          src={
            "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
          }
          headerText="irl.punks"
          subheaderText={`${formatVotesAmount(324234232)} Delegated Votes`}
          address={"0x1234567890123456789012345678901234567890"}
        />
        <AvatarWithText
          size="standard"
          src={
            "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
          }
          headerText="builderscouncil.starknet.eth"
          subheaderText={truncateAddress(
            "0x1234567890123456789012345678901234567890",
          )}
          address={"0x1234567890123456789012345678901234567890"}
          dropdownChildren={
            <>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
              <MenuItem>Item 3</MenuItem>
            </>
          }
        />
        <AvatarWithText
          size="standard"
          src={
            "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
          }
          headerText="cillianhunter.eth"
          subheaderText={truncateAddress(
            "0x1234567890123456789012345678901234567890",
          )}
          address={"0x1234567890123456789012345678901234567890"}
          dropdownChildren={
            <>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
              <MenuItem>Item 3</MenuItem>
            </>
          }
        />
        <AvatarWithText
          size="standard"
          src={null}
          headerText="builderscouncil.starknet.eth"
          subheaderText={truncateAddress(
            "0x1234567890123456789012345678901234567890",
          )}
          address={"0x1234567890123456789012345678901234567890"}
          dropdownChildren={
            <>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
              <MenuItem>Item 3</MenuItem>
            </>
          }
        />
      </VStack>
      <Flex
        px="standard.xl"
        bg="#fff"
        maxWidth="372px"
        pt="standard.3xl"
        mb="200px"
        flexDirection="column"
        border="1px solid #eaeaea"
      >
        <AvatarWithText
          size="standard"
          src={
            "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
          }
          headerText="cillianhunter.eth"
          subheaderText={truncateAddress(
            "0x1234567890123456789012345678901234567890",
          )}
          address={"0x1234567890123456789012345678901234567890"}
          dropdownChildren={
            <>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
              <MenuItem>Item 3</MenuItem>
            </>
          }
        />
        <Box mt="standard.2xl">
          <Button width="100%" variant="secondary" size="standard">
            Undelegate your votes
          </Button>
        </Box>
        <Box mt="standard.md">
          <Banner
            type="pending"
            label="Your votes currently pending to this delegate"
          />
        </Box>
        <Box pt="standard.2xl" pb="standard.2xl">
          <SummaryItems.Root>
            <SummaryItems.Item label="Proposals voted on" value={"2323"} />
            <SummaryItems.Item
              label="Delegated votes"
              value={`${formatVotesAmount(3232)}`}
            />
            <SummaryItems.Item label="Total comments" value={"23"} />
            <SummaryItems.Item
              label="For/against/abstain"
              value={`${23 ?? 0}/${3 ?? 0}/${4 ?? 0}`}
            />
            <SummaryItems.Item label="Delegation agreement" value={"none"} />
            <SummaryItems.Item
              isCopiable
              isTruncated
              label="Starknet address"
              value={"0x1234567890123456789012345678901234567890"}
            />
          </SummaryItems.Root>
        </Box>
      </Flex>
    </Box>
  </ThemeProvider>
);
