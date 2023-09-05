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
          delegateStatement="I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years..."
          delegateType={[
            "Dao",
            "Infrastructure",
            "Web3 Developer",
            "Security",
            "Legal",
          ]}
          address="0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5"
          avatarUrl="https://euc.li/robwalsh.eth"
          delegatedVotes="0"
          ensName="robwalsh.eth"
          onDelegateClick={() => console.log("delegate click")}
        />
        <GovernanceDelegateCard
          delegateStatement="I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years..."
          delegateType={["Dao"]}
          address="0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5"
          avatarUrl="https://euc.li/robwalsh.eth"
          delegatedVotes="0"
          ensName="cillianhunter.eth"
          onDelegateClick={() => console.log("delegate click")}
          profileURL="https://starknet.io"
        />
      </>
    </HStack>
  </ThemeProvider>
);
