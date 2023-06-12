import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  PageTitle,
  ButtonGroup,
  ListRow,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";

export function Page() {
  const proposals = trpc.proposals.getAll.useQuery();

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
      <PageTitle title="Proposals" />
      <AppBar>
        <Box>
          <Box>
            <ButtonGroup
              spacing="8px"
              bg="#EEEEF1"
              padding="2px "
              borderRadius="8px"
            >
              <Button variant="switcher" isActive>
                All
              </Button>
              <Button variant="switcher">SNIPS</Button>
              <Button variant="switcher">Votes</Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          <Button as="a" href="snip/create" size="sm" variant="solid">
            Create SNIP
          </Button>
        </Box>
      </AppBar>
      <ListRow.Container>
        {proposals.data?.map((data) => (
          <ListRow.Root key={data.id} href={`/${data.type}/${data.id}`}>
            <ListRow.MutedText id={data.id} type={data.type} />
            <ListRow.Title label={data.title} />
            {/* <ListRow.Date /> */}

            <ListRow.Comments count={0} />
            <ListRow.Status status={data.status} />
          </ListRow.Root>
        ))}
      </ListRow.Container>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;
