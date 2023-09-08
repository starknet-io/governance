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
import { Box, Popover, Select, SimpleGrid } from "@chakra-ui/react";
import { PageTitle } from "src/PageTitle";
import { Logo } from "src/Logo";
import { ContentContainer } from "src/ContentContainer";
import { DelegateCard } from "src/Card/DelegateCard";
import { Button } from "src/Button";
import { FilterPopoverContent, FilterPopoverIcon } from "src/Filter";
import { Text } from "src/Text";
import { AppBar } from "../../";
import delegatesData from "./delegates.json";

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
              <AppBar.Root>
                <AppBar.Group mobileDirection="row">
                  <Box minWidth={"52px"}>
                    <Text variant="mediumStrong">Sort by</Text>
                  </Box>
                  <Select
                    size="sm"
                    height="36px"
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
                </AppBar.Group>

                <AppBar.Group alignEnd>
                  <Button
                    width={{ base: "100%", md: "auto" }}
                    size="condensed"
                    variant="outline"
                    onClick={() => console.log("clicked")}
                  >
                    Delegate to address
                  </Button>
                  <Button
                    width={{ base: "100%", md: "auto" }}
                    as="a"
                    href="/delegates/create"
                    size="condensed"
                    variant="primary"
                  >
                    Create delegate profile
                  </Button>
                </AppBar.Group>
              </AppBar.Root>
              <SimpleGrid
                position="relative"
                width="100%"
                spacing={4}
                templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
              >
                {delegatesData.map((delegate) => (
                  <DelegateCard
                    statement={delegate.statement}
                    type={delegate.type}
                    votingPower={0}
                    voteCount={0}
                    onDelegateClick={() => console.log("Delegate clicked")}
                    profileURL="https://example.com/profile"
                    key={delegate.id}
                    address={delegate?.author?.address}
                    ensAvatar={delegate?.author?.ensAvatar}
                    ensName={delegate?.author?.ensName}
                  />
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
