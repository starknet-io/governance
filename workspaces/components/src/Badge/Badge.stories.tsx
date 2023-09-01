import { HStack, VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Badge } from "./Badge";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/Badge",
  component: Badge,
} as Meta<typeof Badge>;

export const Badges = () => (
  <ThemeProvider>
    <HStack>
      <VStack p={12} spacing="20px" align="flex-start">
        <Badge variant="active">Active</Badge>
        <Badge variant="closed">Closed</Badge>
        <Badge variant="pending">pending</Badge>
        <Badge variant="draft">Draft</Badge>
        <Badge variant="withdrawn">Withdrawn</Badge>
        <Badge variant="last_call">Last call</Badge>
        <Badge variant="review">Review</Badge>
        <Badge variant="idea">Idea</Badge>
        <Badge variant="final">final</Badge>
        <Badge variant="stagnant">stagnant</Badge>
        <Badge variant="living">living</Badge>
      </VStack>
      <VStack p={12} spacing="28px" align="flex-start">
        <Badge size="condensed" variant="active">
          Active
        </Badge>
        <Badge size="condensed" variant="closed">
          Closed
        </Badge>
        <Badge size="condensed" variant="pending">
          pending
        </Badge>
        <Badge size="condensed" variant="draft">
          Draft
        </Badge>
        <Badge size="condensed" variant="withdrawn">
          Withdrawn
        </Badge>
        <Badge size="condensed" variant="last_call">
          Last call
        </Badge>
        <Badge size="condensed" variant="review">
          Review
        </Badge>
        <Badge size="condensed" variant="idea">
          Idea
        </Badge>
        <Badge size="condensed" variant="final">
          final
        </Badge>
        <Badge size="condensed" variant="stagnant">
          stagnant
        </Badge>
        <Badge size="condensed" variant="living">
          living
        </Badge>
      </VStack>
    </HStack>
  </ThemeProvider>
);
