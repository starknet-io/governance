import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  SearchInput,
  DelegateCard,
  SimpleGrid,
  PageTitle,
  ButtonGroup,
  ContentContainer,
} from "@yukilabs/governance-components";

import { trpc } from "src/utils/trpc";
import { useState } from "react";

export function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const delegates = trpc.delegates.getAll.useQuery();
  trpc.auth.checkAuth.useQuery(undefined, {
    onError: () => {
      setIsAuthenticated(false);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });
  console.log(delegates.data);

  return (
    <ContentContainer>
      <Box>
        <PageTitle
          learnMoreLink="/learn"
          title="Delegates"
          description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
        />
        <AppBar>
          <Box mr="8px">
            <SearchInput />
          </Box>
          <ButtonGroup>
            <Button as="a" href="/delegates/create" variant="outline">
              Filter by
            </Button>
            <Button as="a" href="/delegates/create" variant="outline">
              Sort
            </Button>
          </ButtonGroup>

          {isAuthenticated && (
            <Box display="flex" marginLeft="auto">
              <Button as="a" href="/delegates/create" size="sm" variant="solid">
                Create delegate profile
              </Button>
            </Box>
          )}
        </AppBar>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
        >
          {delegates.data?.map((data) => (
            <DelegateCard key={data.starknetWalletAddress} {...data} />
          ))}
        </SimpleGrid>
      </Box>
    </ContentContainer>
  );
}

export const documentProps = {
  title: "Delegates",
} satisfies DocumentProps;
