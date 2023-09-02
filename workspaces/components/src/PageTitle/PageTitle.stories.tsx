import { VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { PageTitle as GovernancePageTitle } from "./PageTitle";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/PageTitle",
  component: GovernancePageTitle,
} as Meta<typeof GovernancePageTitle>;

export const PageTitle = () => (
  <ThemeProvider>
    <VStack p={12}>
      <>
        <GovernancePageTitle
          title="Home"
          description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
          learnMoreLink="https://google.com"
        />
        <GovernancePageTitle
          title="Home"
          description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
        />
      </>
    </VStack>
  </ThemeProvider>
);
