import { useDynamicContext } from "@dynamic-labs/sdk-react";

export { LayoutDefault };
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Show,
  Flex,
  Skeleton,
  Spinner,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { PageContext } from "../../renderer/types";
import { useHelpMessage } from "src/hooks/HelpMessage";
import React, { useEffect, useState } from "react";
import { usePageContext } from "src/renderer/PageContextProvider";
import { trpc } from "src/utils/trpc";
import { useGlobalSearch } from "src/hooks/GlobalSearch";
import TallyScript from "src/components/TallyScript";
import {
  HamburgerIcon,
  InfoModal,
  Logo,
  ShareDialog,
  Dropdown,
  MenuItem,
  SupportModal,
  Text,
  GlobalSearch,
  SearchIcon,
  NotificationsMenu,
  NotificationItem,
} from "@yukilabs/governance-components";
import { DynamicCustomWidget } from "src/components/DynamicCustomWidget";
import { NavigationMenu } from "src/components/Navigation";
import { BackButton } from "src/components/Header/BackButton";
import { extractAndFormatSlug } from "src/utils/helpers";
import { CloseIcon } from "@dynamic-labs/sdk-react";
import {
  BannedIcon,
  BellIcon,
  ConnectWalletIcon,
  NotificationVotingProposalIcon,
} from "@yukilabs/governance-components/src/Icons/UiIcons";
import { useFetchNotifications } from "../../hooks/useNotifications";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { Indenticon } from "@yukilabs/governance-components/src/Indenticon";

export interface Props {
  readonly pageContext: PageContext;
  readonly children: React.ReactNode;
}
function LayoutDefault(props: Props) {
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const councilResp = trpc.councils.getAll.useQuery();
  const [renderDone, setRenderDone] = useState(false);
  const { user } = usePageContext();
  const { handleLogOut, setShowAuthFlow } = useDynamicContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);

  const {
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
  } = useFetchNotifications();

  useEffect(() => {
    if (user?.banned) {
      setIsBannedModalOpen(true);
      handleLogOut();
    }
  }, [user?.banned]);

  useEffect(() => {
    setRenderDone(true);
  }, []);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (helpMessage === "connectWalletMessage") {
      timer = setTimeout(() => {
        setHelpMessage(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
    // An empty cleanup function when no timeout was set.
    return () => {
      /* no cleanup to run */
    };
  }, [helpMessage, setHelpMessage]);

  const { globalSearchResults, handleGlobalSearchItems } = useGlobalSearch();
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  const formattedSlug = extractAndFormatSlug(`${pageContext?.urlOriginal}`);

  return (
    <>
      <TallyScript />
      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <InfoModal
        isOpen={isBannedModalOpen}
        onClose={() => setIsBannedModalOpen(false)}
        title="Your Account Was Banned"
      >
        <Flex justifyContent="center">
          <Icon as={BannedIcon} boxSize="104px" />
        </Flex>
        <Text size="small">
          We're sorry to let you know that your account has been suspended for
          not following our community guidelines.
          <br />
          <br />
          Rest assured, this was done to ensure a safe and respectful space for
          everyone. If you have any questions or want to appeal, reach out to us
          through our support channels.
          <br />
          <br />
          Thank you for your understanding.
        </Text>
        <Button variant="outline" onClick={() => setIsBannedModalOpen(false)}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        title="Connect wallet"
        isOpen={helpMessage === "connectWalletMessage"}
        onClose={() => setHelpMessage(null)}
      >
        <Flex alignItems="center" justifyContent={"center"}>
          <ConnectWalletIcon boxSize="84" />
        </Flex>
        <Button
          variant="primary"
          onClick={() => {
            setShowAuthFlow(true);
            setHelpMessage(null);
          }}
        >
          Connect
        </Button>
      </InfoModal>

      <Drawer
        isOpen={isOpen}
        size={{ base: "full", md: "sm" }}
        placement="left"
        onClose={onClose}
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent maxHeight={window.innerHeight}>
          <Box position="absolute" top="16px" zIndex="12px">
            <IconButton
              aria-label="Close menu"
              onClick={onClose}
              variant="ghost"
              size="condensed"
              //todo replace with close icon
              icon={<CloseIcon />}
            />
          </Box>
          <Box display={{ base: "none", lg: "flex" }}>
            {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
          </Box>
          <DrawerBody p="0" mt="60px" height={`calc(${window.innerHeight} - 60px)`}>
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex width="100%" minHeight="100vh" direction="row" pt={{ base: "60px", lg: "0" }}>
        <Box
          bg="surface.forms.default"
          width="234px"
          minWidth="234px"
          height="100vh"
          display={{ base: "none", lg: "flex" }}
          flexDirection={"column"}
          position="sticky"
          top="0"
          // overflow={"auto"}
          borderRight="1px solid"
          borderColor="border.forms"
        >
          <Logo href="/" />
          <Flex
            flexDirection={"column"}
            px="standard.sm"
            flex={1}
            pb="standard.md"
          >
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
              user={user}
            />
          </Flex>
        </Box>
        <Flex direction="column" flex="1">
          {/* //Header  */}
          <Box
            position={{ base: "fixed", lg: "sticky" }}
            top="0"
            left="0"
            right="0"
            bg="surface.bgPage"
            zIndex={9999}
            borderBottom="1px solid"
            borderColor="border.forms"
            height={{ base: "60px", md: "68px" }}
            pl={{
              base: "standard.xs",
              md: "standard.md",
            }}
            pr={{
              base: "standard.md",
              md: "standard.xl",
            }}
            py={{
              base: "standard.sm",
              md: "standard.sm",
              lg: "standard.md",
            }}
          >
            <Flex gap="standard.xs">
              <Box display={{ base: "flex", lg: "none" }} gap="standard.base">
                <IconButton
                  aria-label="Open menu"
                  size="condensed"
                  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  onClick={isOpen ? onClose : onOpen}
                  variant="ghost"
                />
                <Show breakpoint="(max-width: 567px)">
                  {user && (
                    <NotificationsMenu
                      notifications={notifications}
                      markAsRead={markAsRead}
                    />
                  )}
                </Show>
                {/* <Show breakpoint="(max-width: 567px)">
                  <IconButton
                    aria-label="Open menu"
                    size="condensed"
                    icon={<SearchIcon />}
                    onClick={() => setIsGlobalSearchOpen(true)}
                    variant="ghost"
                  />
                </Show> */}
              </Box>

              <Box display={{ base: "none", lg: "block" }}>
                <BackButton
                  urlStart={["/delegates/profile/"]}
                  href="/delegates"
                  buttonText="Delegates"
                  pageContext={pageContext}
                />
                <BackButton
                  urlStart={["/voting-proposals/"]}
                  href="/voting-proposals"
                  buttonText="Voting proposals"
                  pageContext={pageContext}
                />

                <BackButton
                  urlStart={[
                    "/councils/security_council/",
                    "/councils/builder_council/",
                  ]}
                  buttonText={formattedSlug}
                  pageContext={pageContext}
                />
              </Box>
              <Flex gap="standard.xs " marginLeft="auto">
                <Box display={{ base: "none", md: "flex" }}>
                  <ShareDialog />
                </Box>
                <Show breakpoint="(min-width: 568px)">
                  {user && (
                    <NotificationsMenu
                      notifications={notifications}
                      markAsRead={markAsRead}
                    />
                  )}
                </Show>
                <Show breakpoint="(min-width: 567px)">
                  <GlobalSearch
                    searchResults={globalSearchResults}
                    onSearchItems={handleGlobalSearchItems}
                    isOpen={isGlobalSearchOpen}
                    setIsSearchModalOpen={setIsGlobalSearchOpen}
                  />
                </Show>
                <Box display={{ base: "flex" }} marginLeft="auto">
                  {renderDone ? (
                    <DynamicCustomWidget />
                  ) : (
                    <Skeleton width="100px" height="36px" />
                  )}
                </Box>
              </Flex>
            </Flex>
          </Box>
          <Box as="main" role="main" flex={1}>
            {children}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
