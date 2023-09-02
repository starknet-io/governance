import { Flex } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { NavItem } from "../NavItem";

import { ThemeProvider } from "../../ThemeProvider";
import {
  DelegatesIcon,
  FeedbackIcon,
  HomeIcon,
  LearnIcon,
  SettingsIcon,
} from "src/Icons";
import { NavGroup as GovernanceNavGroup } from "../NavGroup";

export default {
  title: "governance-ui/Navigation",
  component: GovernanceNavGroup,
} as Meta<typeof GovernanceNavGroup>;

export const NavGroup = () => (
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
        <GovernanceNavGroup label="Nav group title">
          <NavItem active icon={<HomeIcon />} label="Home" />
          <NavItem active icon={<FeedbackIcon />} label="Voting Proposals" />
          <NavItem active icon={<DelegatesIcon />} label="Delegates" />
        </GovernanceNavGroup>
        <GovernanceNavGroup alignEnd label="Nav group aligned bottom">
          <NavItem active icon={<LearnIcon />} label="Learn" />
          <NavItem active icon={<SettingsIcon />} label="Settings" />
          <NavItem
            variant="feedback"
            active
            icon={<FeedbackIcon />}
            label="Feedback"
          />
        </GovernanceNavGroup>
      </>
    </Flex>
  </ThemeProvider>
);
