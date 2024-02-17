import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useIsMobile from "src/hooks/useIsMobile";
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
  SupportModal,
  Text,
  GlobalSearch,
  NotificationsMenu,
} from "@yukilabs/governance-components";
import { DynamicCustomWidget } from "src/components/DynamicCustomWidget";
import { NavigationMenu } from "src/components/Navigation";
import { BackButton } from "src/components/Header/BackButton";
import { extractAndFormatSlug } from "src/utils/helpers";
import { CloseIcon } from "@dynamic-labs/sdk-react-core";
import {
  BannedIcon,
  ConnectWalletIcon,
} from "@yukilabs/governance-components/src/Icons/UiIcons";
import { useWallets } from "../../hooks/useWallets";
import ConnectSecondaryWalletModal from "../../components/ConnectSecondaryWalletModal/ConnectSecondaryWalletModal";
import { navigate } from "vite-plugin-ssr/client/router";

const authenticatedUrls = [
  "voting-proposals/create",
  "delegates/create",
  "delegates/edit",
  "councils/create",
  "councils/edit",
  "learn/create",
];

const adminUrls = ["voting-proposals/create", "councils/create", "learn/create", "councils/edit"];

export interface Props {
  readonly pageContext: PageContext;
  readonly children: React.ReactNode;
}
function LayoutDefault(props: Props) {
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { starknetWallet, ethWallet } = useWallets();
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isUserLoading } = usePageContext();
  const { data: userDelegate } = trpc.users.isDelegate.useQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user?.id,
    },
  );
  const councilResp = trpc.councils.getAll.useQuery();
  const [renderDone, setRenderDone] = useState(false);
  const { handleLogOut, setShowAuthFlow } = useDynamicContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);
  const [showEthModal, setShowEthModal] = useState(false);
  const [showStarkModal, setShowStarkModal] = useState(false);

  useEffect(() => {
    if (user?.banned) {
      setIsBannedModalOpen(true);
      handleLogOut();
    }
  }, [user?.banned]);

  useEffect(() => {
    if (!isUserLoading) {
      const urlPath = pageContext?.urlOriginal;
      const redirectToHome = () => {
        navigate("/");
      };

      if (!user) {
        const isAuthRequiredPage = authenticatedUrls.some((path) =>
          urlPath.includes(path),
        );
        if (isAuthRequiredPage) {
          redirectToHome();
        }
      } else {
        const isAdminPage = adminUrls.some((path) => urlPath.includes(path));
        if (
          isAdminPage &&
          user.role !== "admin" &&
          user.role !== "superadmin"
        ) {
          redirectToHome();
        }
      }
    }
  }, [user, pageContext?.urlOriginal, isUserLoading]);

  useEffect(() => {
    if (userDelegate && user) {
      if (!ethWallet?.address && starknetWallet?.address) {
        setShowEthModal(true);
        setShowStarkModal(false);
      } else if (!starknetWallet?.address && ethWallet?.address) {
        setShowStarkModal(true);
        setShowEthModal(false);
      } else {
        setShowStarkModal(false);
        setShowEthModal(false);
      }
    } else {
      setShowStarkModal(false);
      setShowEthModal(false);
    }
  }, [userDelegate, starknetWallet?.address, ethWallet?.address]);

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
  const {
    isOpen: isGlobalSearchOpen,
    onOpen: onGlobalSearchOpen,
    onClose: onGlobalSearchClose,
  } = useDisclosure();
  const { isTablet } = useIsMobile();

  const formattedSlug = extractAndFormatSlug(`${pageContext?.urlOriginal}`);

  const [windowHeight, setWindowHeight] = useState("100vh");
  useEffect(() => {
    const checkWindowHeight = () => {
      setWindowHeight(window?.innerHeight.toString());
    };
    checkWindowHeight();
    window.addEventListener("resize", checkWindowHeight);
    return () => window.removeEventListener("resize", checkWindowHeight);
  }, []);

  return (
    <>
      <TallyScript />
      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ConnectSecondaryWalletModal
        isOpen={showEthModal || showStarkModal}
        onClose={() => {
          setShowStarkModal(false);
          setShowEthModal(false);
        }}
        onNext={() => {
          setShowStarkModal(false);
          setShowEthModal(false);
        }}
        shouldConnectStarknet={showStarkModal}
        shouldConnectEthereum={showEthModal}
      />
      <InfoModal
        isOpen={isBannedModalOpen}
        onClose={() => setIsBannedModalOpen(false)}
        title="Your Account Was Banned"
        size="smBodyMd"
      >
        <Flex direction="column" gap="standard.md">
          <Flex justifyContent="center">
            <Icon as={BannedIcon} boxSize="104px" />
          </Flex>
          <Text size="small">
            We're sorry to let you know that your account has been suspended for
            not following our community guidelines.
            <br />
            <br />
            Rest assured, this was done to ensure a safe and respectful space
            for everyone. If you have any questions or want to appeal, reach out
            to us through our support channels.
            <br />
            <br />
            Thank you for your understanding.
          </Text>
          <Button variant="outline" onClick={() => setIsBannedModalOpen(false)}>
            Close
          </Button>
        </Flex>
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
        isOpen={isTablet ? isOpen : false}
        size={{ base: "full", md: "sm" }}
        placement="left"
        onClose={onClose}
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent maxHeight={windowHeight}>
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
          <DrawerBody
            p="0"
            mt={{ base: "60px", md: "68px" }}
            height={{
              base: `calc(${windowHeight}px - 60px)`,
              md: `calc(${windowHeight}px - 68px)`,
            }}
          >
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex
        width="100%"
        minHeight="100vh"
        direction="row"
        pt={{ base: "60px", lg: "0" }}
      >
        <Box
          bg="surface.forms.default"
          width="234px"
          minWidth={["0", "0", "0", "234px"]}
          height="100vh"
          display={{ base: "none", lg: "flex" }}
          flexDirection={"column"}
          position="fixed"
          zIndex={100}
          top="0"
          // overflow={"auto"}
          borderRight="1px solid"
          borderColor="border.forms"
        >
          <Logo href="/" />
          <Flex flexDirection={"column"} flex={1} pb="standard.xs">
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
              user={user}
            />
          </Flex>
        </Box>
        <Flex direction="column" flex="1" ml={["0", "0", "0", "234px"]}>
          {/* //Header  */}
          <Box
            position="fixed"
            top="0"
            left={["0", "0", "0", "234px"]}
            right="0"
            bg="surface.bgPage"
            zIndex={999}
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
                  {user && <NotificationsMenu />}
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
                <Box display={{ base: "flex" }}>
                  <ShareDialog />
                </Box>
                <Show breakpoint="(min-width: 568px)">
                  {user && <NotificationsMenu />}
                </Show>
                <Show breakpoint="(min-width: 1079px)">
                  <GlobalSearch
                    searchResults={globalSearchResults}
                    onSearchItems={handleGlobalSearchItems}
                    isOpen={isGlobalSearchOpen}
                    onGlobalSearchOpen={onGlobalSearchOpen}
                    onGlobalSearchClose={onGlobalSearchClose}
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
          <Box as="main" role="main" flex={1} mt={[0, 0, 0, "68px"]}>
            {children}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
