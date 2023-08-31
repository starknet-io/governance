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
          id="ewerwer"
          delegateStatement="sadf  asdfasdf asdfasdf sadf asdfas df"
          delegateType="wqqwe "
          address="0x12123123123123123123123123123"
          avatarUrl="232323"
          delegatedVotes="32e4234"
          ensName="asdfasdf"
        />
      </>
    </HStack>
  </ThemeProvider>
);
