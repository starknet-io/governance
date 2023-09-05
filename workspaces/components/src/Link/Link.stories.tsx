import { HStack, VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Link as GovernanceLink } from "./Link";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui",
  component: GovernanceLink,
} as Meta<typeof GovernanceLink>;

export const Link = () => (
  <ThemeProvider>
    <HStack>
      <VStack p={12} align="flex-start">
        <GovernanceLink href="http://www.google.com" variant="primary">
          Review
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          variant="primary"
          isExternal
        >
          Link
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          size="small"
          variant="primary"
        >
          Link
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          size="small"
          variant="primary"
          isExternal
        >
          Link
        </GovernanceLink>
      </VStack>
      <VStack p={12} align="flex-start">
        <GovernanceLink href="http://www.google.com" variant="secondary">
          Link
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          variant="secondary"
          isExternal
        >
          Link
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          size="small"
          variant="secondary"
        >
          Link
        </GovernanceLink>
        <GovernanceLink
          href="http://www.google.com"
          size="small"
          variant="secondary"
          isExternal
        >
          Link
        </GovernanceLink>
      </VStack>
    </HStack>
  </ThemeProvider>
);
