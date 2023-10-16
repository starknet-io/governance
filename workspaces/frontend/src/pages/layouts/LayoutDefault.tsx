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
  Spinner,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { PageContext } from "../../renderer/types";
import { useHelpMessage } from "src/hooks/HelpMessage";
import { useEffect, useState } from "react";
import { usePageContext } from "src/renderer/PageContextProvider";
import { trpc } from "src/utils/trpc";
import TallyScript from "src/components/TallyScript";
import {
  FeedbackIcon,
  HamburgerIcon,
  Header,
  InfoModal,
  Layout,
  Logo,
  ShareDialog,
  SupportModal,
  Text,
} from "@yukilabs/governance-components";
import { DynamicCustomWidget } from "src/components/DynamicCustomWidget";
import { NavigationMenu } from "src/components/Navigation";
import { BackButton } from "src/components/Header/BackButton";
import { BannedIcon } from "@yukilabs/governance-components/src/Icons/UiIcons";

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
  const { handleLogOut } = useDynamicContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);

  useEffect(() => {
    console.log(user)
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
          Rest assured, this was done to
          ensure a safe and respectful space for everyone. If you have any
          questions or want to appeal, reach out to us through our support
          channels.
          <br />
          <br />
          Thank you for your understanding.
        </Text>
        <Button variant="outline" onClick={() => setIsBannedModalOpen(false)}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        title="connect your wallet"
        isOpen={helpMessage === "connectWalletMessage"}
        onClose={() => setHelpMessage(null)}
      >
        <Text>To action you need to connect your wallet</Text>
        <Button variant="primary" onClick={() => console.log("connect wallet")}>
          Connect
        </Button>
      </InfoModal>

      <Drawer
        isOpen={isOpen}
        size={{ base: "full", md: "sm" }}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Box position="absolute" top="16px" zIndex="12px">
            <IconButton
              aria-label="Close menu"
              onClick={onClose}
              variant="ghost"
              size="condensed"
              //todo replace with close icon
              icon={<div>X</div>}
            />
          </Box>
          <Box display={{ base: "none", lg: "flex" }}>
            {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
          </Box>

          <DrawerBody px="12px" py="16px" pt="0" mt="48px">
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Layout.Root>
        <Layout.LeftAside>
          <Logo href="/" />
          <NavigationMenu
            pageContext={pageContext}
            userRole={user?.role}
            councilData={councilResp.data}
            openSupportModal={() => setIsModalOpen(!isModalOpen)}
            user={user}
          />
        </Layout.LeftAside>
        <Layout.Main>
          <Header>
            <Box display={{ base: "block", lg: "none" }}>
              <IconButton
                aria-label="Open menu"
                size="condensed"
                // toDo replace with x icon
                icon={isOpen ? <HamburgerIcon /> : <HamburgerIcon />}
                onClick={onOpen}
                variant="ghost"
              />
            </Box>
            <Box display={{ base: "none", lg: "block" }}>
              <BackButton
                urlStart="/delegates/profile/"
                href="/delegates"
                buttonText="Delegates"
                pageContext={pageContext}
              />
              <BackButton
                urlStart="/voting-proposals/"
                href="/voting-proposals"
                buttonText="Voting proposals"
                pageContext={pageContext}
              />
              <BackButton
                urlStart="/snips/"
                href="/snips"
                buttonText="Core snips"
                pageContext={pageContext}
              />
              <BackButton
                urlStart="/councils/"
                href="/councils"
                buttonText="Back to councils"
                pageContext={pageContext}
              />
            </Box>
            <Show breakpoint="(min-width: 834px)">
              <Box
                display={{ base: "flex", lg: "none" }}
                flex="1"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Logo href="/" />
              </Box>
            </Show>

            <Box display="flex" marginLeft="auto">
              <ShareDialog />
            </Box>
            <Box display={{ base: "flex" }}>
              {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
            </Box>
            <Box display={{ base: "none", lg: "none" }} marginLeft="auto">
              <IconButton
                aria-label="Open menu"
                size="condensed"
                icon={<FeedbackIcon />}
                onClick={onOpen}
                variant="feedback"
              />
            </Box>
          </Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
