import { Flex } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { NavItem as GovernanceNavItem } from "./NavItem";

import { ThemeProvider } from "../../ThemeProvider";
import {
  DelegatesIcon,
  FeedbackIcon,
  HomeIcon,
  LearnIcon,
  SettingsIcon,
} from "src/Icons";
import { NavGroup } from "../NavGroup";

export default {
  title: "governance-ui/Navigation",
  component: GovernanceNavItem,
} as Meta<typeof GovernanceNavItem>;

export const NavItem = () => (
  <ThemeProvider>
    <Flex
      flexDirection={"column"}
      bg="#FBFBFB"
      width="300px"
      padding="12px"
      gap="2px"
      height="90vh"
    >
      <>
        <GovernanceNavItem active icon={<HomeIcon />} label="Home" />
        <GovernanceNavItem
          variant="feedback"
          active
          icon={<FeedbackIcon />}
          label="Feedback"
        />
      </>
    </Flex>
  </ThemeProvider>
);
