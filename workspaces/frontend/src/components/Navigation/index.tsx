import { Box, Show } from "@chakra-ui/react";
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
  FeedbackIcon,
  Button,
} from "@yukilabs/governance-components";
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
  return (
    <>
      <Box mt="-20px">
        <NavGroup>
          <Show breakpoint="(max-width: 834px)">
            <Box alignItems={"center"} justifyContent={"center"}>
              <Logo href="/" />
            </Box>
          </Show>
          {[
            {
              href: "/",
              label: "Home",
              icon: <HomeIcon />,
              exact: true,
            },
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
        </NavGroup>
      </Box>
      <NavGroup label="Councils">
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
              href={council.slug ? `/councils/${council.slug}` : "/councils"}
              active={pageContext.urlOriginal.startsWith(
                `/councils/${council.slug}`,
              )}
            />
          ))}

        {hasPermission(userRole, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
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
        ) : (
          <></>
        )}
      </NavGroup>
      <NavGroup alignEnd>
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

        {user ? (
          <NavItem href="/settings" icon={<SettingsIcon />} label="Settings" />
        ) : null}
        <NavItem
          icon={<SupportIcon />}
          label="Support"
          onClick={openSupportModal}
        />

        <Box as="span" display={{ base: "none", lg: "flex" }}>
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
    </>
  );
};
