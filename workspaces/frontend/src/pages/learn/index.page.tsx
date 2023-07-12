import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ContentContainer,
  Stack,
  Heading,
  Text,
  Flex,
  Stat,
  Button,
  NavItem,
} from "@yukilabs/governance-components";

export function Page() {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
      <Box
        pt="40px"
        px="16px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "270px" }}
        position={{ base: "unset", lg: "sticky" }}
        height="calc(100vh - 80px)"
        top="0"
      >
        <Stack
          spacing="12px"
          direction={{ base: "column" }}
          color="#545464"
          mb="24px"
        >
          <NavItem
            href="/learn"
            label="Governance for dummies"
            active="/learn"
          />
          <NavItem href="/learn" label="What are SNIPs?" />
          <NavItem href="/learn" label="How do votes work?" />
          <NavItem href="/learn" label="What are delegates?" />
          <NavItem href="/learn" label="How do I delegate my votes?" />
          <NavItem href="/learn" label="What are councils?" />
          <NavItem href="/learn" label="How can I get involved?" />
        </Stack>
        {/* // show for admin role */}
        <Button variant="outline">Add new page</Button>
      </Box>
      <Box ml="auto" mr="auto" pb="200px">
        <ContentContainer maxWidth="800px">
          <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                Governance for dummies
              </Heading>
              <Flex gap="90px" paddingTop="24px">
                <Stat.Root>
                  <Stat.Label>Created on</Stat.Label>
                  <Stat.Text label="Jun 25, 2023, 5:00 PM" />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Label>Created by</Stat.Label>
                  <Stat.Text label={"sylve.eth"} />
                </Stat.Root>
              </Flex>

              <Text variant="body">
                If youve ever wondered how the wild west of the Internet - the
                land of decentralized protocols - manages to maintain some
                semblance of order, then youre in the right place. Its like
                stepping into a party where everyone has a say in the playlist,
                and the chaos that ensues is precisely what makes it a blast.
                Lets unravel this techno-mumbo-jumbo and understand how this
                crowd-managed circus, also known as decentralized governance,
                works.
              </Text>
              <Heading color="#33333E" variant="h3">
                The big picture
              </Heading>
              <Text variant="body">
                Picture the regular world - youve got governments, corporations,
                boards - entities with power who make decisions. In the
                decentralized world, its like taking that power and throwing it
                into a crowd at a rock concert, hoping that they catch it and
                make decisions collaboratively. Scary? Maybe. Exciting?
                Definitely.
              </Text>
              <Text variant="body">
                Protocols like Ethereum and StarkNet, at their core, operate on
                this principle. Everyone has a voice, or more accurately, a
                vote. The many manage themselves without the need for the few.
              </Text>
              <Text variant="body">
                Take an active part in encouraging discussions and votes during
                the first phase on behalf of StarkNet community members.
              </Text>
              <Text variant="body">
                Ensure transparency of the Council’s discussions, decisions, and
                activities.
              </Text>
              <Text variant="body">
                Take an active part in encouraging discussions and votes during
                the first phase on behalf of StarkNet community members.
              </Text>
              <Text variant="body">
                Ensure transparency of the Council’s discussions, decisions, and
                activities.
              </Text>
            </Stack>
          </Stack>
        </ContentContainer>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Learn / home",
} satisfies DocumentProps;
