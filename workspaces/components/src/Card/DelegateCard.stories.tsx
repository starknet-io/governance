import { HStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { DelegateCard as GovernanceDelegateCard } from "./DelegateCard";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/Cards",
  component: GovernanceDelegateCard,
} as Meta<typeof GovernanceDelegateCard>;

export const DelegateCard = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <GovernanceDelegateCard
          delegateStatement="sadf  asdfasdf asdfasdf sadf asdfas df"
          delegateType={[
            "Dao",
            "Infrastructure",
            "Web3 Developer",
            "Security",
            "Legal",
          ]}
          address="0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5"
          avatarUrl="https://euc.li/robwalsh.eth"
          delegatedVotes="32e4234"
          ensName="robwalsh.eth"
          onDelegateClick={() => console.log("delegate click")}
        />
        <GovernanceDelegateCard
          delegateStatement="sadf  asdfasdf asdfasdf sadf asdfas df"
          delegateType={["Dao"]}
          address="0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5"
          avatarUrl="https://euc.li/robwalsh.eth"
          delegatedVotes="32e4234"
          ensName="robwalsh.eth"
          onDelegateClick={() => console.log("delegate click")}
          profileURL="https://starknet.io"
        />
      </>
    </HStack>
  </ThemeProvider>
);
