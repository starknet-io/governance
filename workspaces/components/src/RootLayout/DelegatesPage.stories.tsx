import { Meta } from "@storybook/react";
import * as Layout from "./RootLayout";
import { ThemeProvider } from "../ThemeProvider";
import { NavGroup } from "src/Navigation/NavGroup";
import { NavItem } from "src/Navigation/NavItem";

import {
  BuildersIcon,
  DelegatesIcon,
  FeedbackIcon,
  FiltersIcon,
  HomeIcon,
  LearnIcon,
  ProposalsIcon,
  SecurityIcon,
  SettingsIcon,
} from "src/Icons";
import { Header } from "src/Header";
import {
  Box,
  ButtonGroup,
  Flex,
  Popover,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { PageTitle } from "src/PageTitle";
import { Logo } from "src/Logo";
import { ContentContainer } from "src/ContentContainer";
import { DelegateCard } from "src/Card/DelegateCard";
import { Button } from "src/Button";
import { FilterPopoverContent, FilterPopoverIcon } from "src/Filter";
import { Text } from "src/Text";
import { AppBar } from "src/AppBar";

const delegatesData = [
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
  {
    address: "0x391316cF14cc62ef9C384e8D7EaE3ca7F111DbA5",
    avatarUrl: "https://euc.li/robwalsh.eth",
    delegatedVotes: "0",
    ensName: "robwalsh.eth",
    delegateType: [
      "Dao",
      "Infrastructure",
      "Web3 Developer",
      "Security",
      "Legal",
    ],
    delegateStatement:
      "I have a background in theoretical computer science and cryptography and I have been deeply interested in decentralization for the past 10 years...",
  },
];

// import { PopoverIcon } from "../../components/Layout/Navbar/PopoverIcon";

export default {
  title: "governance-ui/Layout",
  component: Layout.Root,
} as Meta<typeof Layout.Root>;

export const DelegatesPage = () => (
  <ThemeProvider>
    <Layout.Root>
      <Layout.LeftAside>
        <Logo href="/" />
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
      </Layout.LeftAside>
      <Layout.Main>
        <Header>Header</Header>
        <Layout.Content>
          <ContentContainer>
            <Box width="100%">
              <PageTitle
                learnMoreLink="/learn"
                title="Delegates"
                description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
              />
              <AppBar>
                <Flex flexDirection={"row"} gap="4px" alignItems={"center"}>
                  <Box minWidth={"50px"}>
                    <Text
                      fontSize="14px"
                      fontWeight={"600"}
                      lineHeight="20px"
                      letterSpacing={"0.07px"}
                    >
                      Sort by
                    </Text>
                  </Box>
                  <Select
                    size="sm"
                    aria-label="Sort by"
                    placeholder="Sort by"
                    focusBorderColor={"red"}
                    rounded="md"
                    value={"option1"}
                  >
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </Flex>
                <ButtonGroup display={{ base: "none", md: "flex" }} ml="8px">
                  <Popover placement="bottom-start">
                    <FilterPopoverIcon
                      label="Filter by"
                      icon={FiltersIcon}
                      badgeContent={0}
                    />
                    <FilterPopoverContent>
                      <Text mt="4" mb="2" fontWeight="bold">
                        Filters
                      </Text>

                      <Text mt="4" mb="2" fontWeight="bold">
                        Interests
                      </Text>
                    </FilterPopoverContent>
                  </Popover>
                </ButtonGroup>
                <Box display="flex" marginLeft="auto" gap="12px">
                  <Button
                    size="condensed"
                    variant="outline"
                    onClick={() => console.log("clicked")}
                  >
                    Delegate to address
                  </Button>
                  <Button
                    as="a"
                    href="/delegates/create"
                    size="condensed"
                    variant="primary"
                  >
                    Create delegate profile
                  </Button>
                </Box>
              </AppBar>
              <SimpleGrid
                position="relative"
                width="100%"
                spacing={4}
                templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
              >
                {delegatesData.map((delegate, i) => (
                  <DelegateCard {...delegate} key={i} />
                ))}
              </SimpleGrid>
            </Box>
          </ContentContainer>
        </Layout.Content>
      </Layout.Main>
      {/* <Layout.RightAside /> */}
    </Layout.Root>
  </ThemeProvider>
);
