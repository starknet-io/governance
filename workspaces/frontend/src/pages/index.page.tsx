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
import { useHelpMessage } from "src/hooks/HelpMessage";
import { Delegates } from "src/components/Delegates";
import { trpc } from "src/utils/trpc";
import { Proposal, VotingPropsSkeleton } from "./voting-proposals/index.page";
import { useStarknetBalance } from "../hooks/starknet/useStarknetBalance";
import { formatVotingPower } from "../utils/helpers";
import { useTotalSupply } from "../utils/hooks";
import { usePageContext } from "../renderer/PageContextProvider";
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
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { user } = usePageContext();

  const { data: stats } = trpc.stats.getStats.useQuery();
  const formattedL2Delegated = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stats?.l2Delegated || 0);
  const formattedL1Delegated = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stats?.l1Delegated || 0);
  const selfDelegatedPercentage =
    stats?.l2Delegated &&
    stats?.l1Delegated &&
    stats?.selfDelegatedTotal &&
    stats?.l2Delegated + stats?.l1Delegated !== 0
      ? new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(
          (stats?.selfDelegatedTotal /
            (stats?.l2Delegated + stats?.l1Delegated)) *
            100 || 0,
        )
      : 0;
  const vStarkTotalBalance = useStarknetBalance({
    starkContract: import.meta.env.VITE_APP_VSTRK_CONTRACT,
    totalSupply: true,
  });
  const starkTotalBalance = useStarknetBalance({
    starkContract: import.meta.env.VITE_APP_STRK_CONTRACT,
    totalSupply: true,
  });
  // const totalSupplyL1 = useTotalSupply(
  //   import.meta.env.VITE_APP_STARKNET_REGISTRY,
  // );
  return (
    <Box width="100%">
      <BannerHome
        onDownloadNotConnected={
          user ? null : () => setHelpMessage("connectWalletMessage")
        }
        l2Delegated={formattedL2Delegated}
        l1Delegated={formattedL1Delegated}
        selfDelegatedPercentage={selfDelegatedPercentage}
        vSTRKTotal={formatVotingPower(
          vStarkTotalBalance?.balance?.rawBalance || "0",
        )}
        STRKTotal={formatVotingPower(
          starkTotalBalance?.balance?.rawBalance || "0",
        )}
      />
      <HomeContainer
        position={"relative"}
        display="grid"
        gap="standard.3xl"
        mb="standard.3xl"
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
          disableFetch={true}
          transformData={(data) => data.slice(0, 6)}
          showAllDeligatesLink={true}
        />
      </HomeContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Home",
  image: "/social/social-home.png",
} satisfies DocumentProps;
