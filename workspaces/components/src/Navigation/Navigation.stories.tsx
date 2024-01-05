import { Flex } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { NavItem } from "./NavItem";

import { ThemeProvider } from "../ThemeProvider";
import {
  BuildersIcon,
  DelegatesIcon,
  FeedbackIcon,
  HomeIcon,
  LearnIcon,
  ProposalsIcon,
  SecurityIcon,
  SettingsIcon,
  VoteIcon,
} from "..//Icons";
import { NavGroup } from "./NavGroup";

export default {
  title: "governance-ui/Navigation",
  component: NavItem,
} as Meta<typeof NavItem>;

export const Navigation = () => (
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
        <NavGroup>
          <NavItem active icon={<HomeIcon />} label="Home" />
          <NavItem active icon={<ProposalsIcon />} label="Voting Proposals" />
          <NavItem active icon={<DelegatesIcon />} label="Delegates" />
        </NavGroup>
        <NavGroup label="Councils">
          <NavItem active icon={<BuildersIcon />} label="Builders" />
          <NavItem active icon={<SecurityIcon />} label="Security" />
        </NavGroup>
        <NavGroup alignEnd>
          <NavItem active icon={<LearnIcon />} label="Learn" />
          <NavItem active icon={<SettingsIcon />} label="Settings" />
          <NavItem
            variant="feedback"
            active
            icon={<FeedbackIcon />}
            label="Feedback"
          />
        </NavGroup>
      </>
    </Flex>
  </ThemeProvider>
);
