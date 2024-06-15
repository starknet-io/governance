import { useState } from "react";
import { Box, Flex, Show } from "@chakra-ui/react";
import {
  BuildersIcon,
  IconButton,
  DelegatesIcon,
  HomeIcon,
  Link,
  Logo,
  NavGroup,
  NavItem,
  ProposalsIcon,
  SecurityIcon,
  PlusIcon,
  LearnIcon,
  SettingsIcon,
  SupportIcon,
  GlobalSearch,
  FeedbackIcon,
  Button,
  StarknetCommunityIcon,
  useDisclosure,
  Text,
} from "@yukilabs/governance-components";
import { useGlobalSearch } from "src/hooks/GlobalSearch";
import {
  CommunityLinksIcon,
  MoneyIcon,
} from "@yukilabs/governance-components/src/Icons";
import { IUser, ROLES } from "src/renderer/types";
import { hasPermission } from "src/utils/helpers";

export interface NavigationMenuProps {
  pageContext: any;
  userRole: string | undefined;
  councilData: any[] | undefined;
  openSupportModal: () => void;
  user?: IUser | null;
}

export const NavigationMenu = ({
  pageContext,
  userRole,
  councilData,
  openSupportModal,
  user,
}: NavigationMenuProps) => {
  const { globalSearchResults, handleGlobalSearchItems } = useGlobalSearch();
  const {
    isOpen: isGlobalSearchOpen,
    onOpen: onGlobalSearchOpen,
    onClose: onGlobalSearchClose,
  } = useDisclosure();
  const isMobile = typeof window !== "undefined" && window?.screen?.width < 567;
  return (
    <>
      <Flex
        flexDirection={"column"}
        justifyContent="space-between"
        height="100%"
        overflowY={isMobile ? "scroll" : "auto"}
        flex={1}
      >
        <NavGroup align="start">
          <Show breakpoint="(max-width: 1078px)">
            <Box alignItems={"flex-start"} justifyContent={"center"}>
              <Logo href="/" padding="20px 16px 12px 16px" />
            </Box>
            <Box py="standard.xs" px="standard.md">
              <GlobalSearch
                searchResults={globalSearchResults}
                onSearchItems={handleGlobalSearchItems}
                isOpen={isGlobalSearchOpen}
                onGlobalSearchOpen={onGlobalSearchOpen}
                onGlobalSearchClose={onGlobalSearchClose}
              />
            </Box>
          </Show>
          <Box py="standard.xs" px="standard.sm">
            <NavItem
              active={pageContext.urlOriginal === "/"}
              icon={<HomeIcon />}
              label="Home"
              href="/"
            />
            <NavItem
              active={pageContext.urlOriginal === "/manage-vstrk"}
              icon={<MoneyIcon />}
              label="Manage vSTRK"
              href="/manage-vstrk"
            />

            {[
              {
                href: "/voting-proposals",
                label: "Voting proposals",
                icon: <ProposalsIcon />,
              },
              {
                href: "/delegates",
                label: "Delegates",
                icon: <DelegatesIcon />,
              },
            ].map((item) => (
              <NavItem
                active={
                  item.exact
                    ? pageContext.urlOriginal === item.href
                    : pageContext.urlOriginal.startsWith(item.href)
                }
                icon={item.icon}
                label={item.label}
                key={item.href}
                href={item.href}
              />
            ))}
            {councilData
              ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
              .map((council) => (
                <NavItem
                  key={council.id}
                  icon={
                    council.name?.toLowerCase().startsWith("builder") ? (
                      <BuildersIcon />
                    ) : (
                      <SecurityIcon />
                    )
                  }
                  label={council.name ?? "Unknown"}
                  href={
                    council.slug ? `/councils/${council.slug}` : "/councils"
                  }
                  active={pageContext.urlOriginal.startsWith(
                    `/councils/${council.slug}`,
                  )}
                />
              ))}
          </Box>
          {hasPermission(userRole, [
            ROLES.ADMIN,
            ROLES.MODERATOR,
            ROLES.SUPERADMIN,
          ]) ? (
            <Box py="standard.xs" px="standard.sm">
              <Link
                href="/councils/create"
                style={{ border: "none", marginLeft: "6px" }}
              >
                <IconButton
                  aria-label="create"
                  variant="ghost"
                  size="condensed"
                  icon={<PlusIcon />}
                />
              </Link>
            </Box>
          ) : (
            <></>
          )}
        </NavGroup>

        <Box py="standard.xs" px="standard.sm">
          <NavGroup align="end">
            {[
              {
                href: "/learn",
                label: "Learn",
                icon: <LearnIcon />,
              },
            ].map((item) => (
              <NavItem
                active={pageContext?.urlOriginal?.startsWith(item.href)}
                icon={item.icon}
                label={item.label}
                key={item.href}
                href={item.href}
              />
            ))}

            {hasPermission(userRole, [
              ROLES.ADMIN,
              ROLES.MODERATOR,
              ROLES.SUPERADMIN,
            ]) ? (
              <NavItem
                href="/settings"
                icon={<SettingsIcon />}
                label="Settings"
              />
            ) : null}
            <NavItem
              icon={<CommunityLinksIcon />}
              label="Community links"
              onClick={openSupportModal}
            />
            <Box as="span" display="flex">
              <Button
                variant="feedback"
                leftIcon={<FeedbackIcon />}
                data-tally-open="3xMJly"
                data-tally-emoji-text="👋"
                data-tally-emoji-animation="wave"
                padding={"12px"}
                width={"100%"}
                justifyContent={"flex-start"}
              >
                Feedback
              </Button>
            </Box>
          </NavGroup>
        </Box>
      </Flex>
    </>
  );
};

