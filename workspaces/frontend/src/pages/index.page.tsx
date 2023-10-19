import { DocumentProps } from "src/renderer/types";

import { Flex, Link } from "@chakra-ui/react";
import {
  BannerHome,
  Box,
  Button,
  EmptyState,
  Heading,
  HomeContainer,
  LearnBanner,
  ListRow,
  Text,
  ArrowRightIcon,
} from "@yukilabs/governance-components";

import { Delegates } from "src/components/Delegates";
import { trpc } from "src/utils/trpc";
import { Proposal, VotingPropsSkeleton } from "./voting-proposals/index.page";
// import img from '../images/social-home.png'

export function Page() {
  const {
    data,
    isLoading: loading,
    isError: error,
    refetch,
  } = trpc.proposals.getProposals.useQuery({
    filters: [],
    sortBy: "desc",
  });

  return (
    <Box width="100%">
      <BannerHome />
      <HomeContainer
        position={"relative"}
        display="grid"
        gap="standard.3xl"
        mb="standard.3xl"
        mt="16px"
      >
        <Box mt="standard.3xl">
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Heading size="lg" variant="h2">
                Starknet voting proposals
              </Heading>
              <Text
                variant="cardBody"
                mt="standard.base"
                mb="standard.xl"
                color="content.support.default"
              >
                Review, discuss and vote on the future of Starknet’s core
                protocol
              </Text>
            </Box>
            <Button
              variant="outline"
              display="flex"
              gap="standard.xs"
              as={Link}
              href="/voting-proposals"
              px={{
                base: "standard.sm",
                lg: "standard.lg",
              }}
            >
              <Box
                display={{
                  base: "none",
                  lg: "block",
                }}
              >
                All voting proposals
              </Box>
              <ArrowRightIcon />
            </Button>
          </Flex>
          <ListRow.Container mt={0}>
            {loading ? (
              <VotingPropsSkeleton
                numRows={5}
                numSkeletonsPerRow={4}
                firstSkeletonWidth="600%"
              />
            ) : error ? (
              // <Box position="absolute" inset="0" top="-25px" bg="#F9F8F9">
              <EmptyState
                type="votes"
                title="Something went wrong"
                minHeight="300px"
                action={
                  <Button variant="primary" onClick={() => refetch}>
                    Retry
                  </Button>
                }
              />
            ) : // </Box>
            data.length > 0 ? (
              data
                .slice(0, 5)
                .map((item: any) => <Proposal key={item?.id} data={item} />)
            ) : (
              // <Box position="absolute" inset="0">
              <EmptyState
                type="votes"
                title="No voting proposals"
                // minHeight="300px"
                action={
                  <Button
                    variant="primary"
                    as="a"
                    href="/voting-proposals/create"
                  >
                    Create first voting proposal
                  </Button>
                }
              />
              // </Box>
            )}
          </ListRow.Container>
        </Box>
        <LearnBanner />
        <Delegates
          showFilers={false}
          transformData={(data) => data.slice(0, 6)}
          showAllDeligatesLink={true}
        />
      </HomeContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Home",
  image: "src/images/social-home.png",
} satisfies DocumentProps;
