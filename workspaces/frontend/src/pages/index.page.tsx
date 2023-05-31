import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  ListRowContainer,
  ListRow,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";

type DataType = {
  id: number;
  title: string;
  status: "last_call" | "review";
  for: number;
  against: number;
  noOfComments: number;
  type: "snip" | "vote";
};

const mockData: DataType[] = [
  {
    id: 1,
    title: "Support for scoped storage variables",
    status: "last_call",
    for: 2,
    against: 12,
    noOfComments: 18,
    type: "snip",
  },
  {
    id: 2,
    title:
      "Starknet Decentralized Protocol II - Candidate for Leader Elections",
    status: "last_call",
    for: 0,
    against: 344,
    noOfComments: 77,
    type: "vote",
  },
  {
    id: 3,
    title: "Transition to full Proof of stake",
    status: "last_call",
    for: 4567,
    against: 0,

    noOfComments: 32,
    type: "vote",
  },
  {
    id: 4,
    title: "Starknet Account Abstraction Model - Part 2",
    status: "last_call",
    for: 6702,
    against: 1222,
    noOfComments: 120,
    type: "snip",
  },
];

export function Page() {
  const userQuery = trpc.users.getAll.useQuery();

  return (
    <>
      <AppBar>
        <Box>
          <Box>
            <Button variant="outline">All</Button>
            <Button variant="outline">SNIPS</Button>
            <Button variant="outline">Votes</Button>
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          <Button as="a" href="vote/create" variant="outline">
            Create proposal
          </Button>
        </Box>
      </AppBar>

      {userQuery.data?.map((u, i) => (
        <pre key={i}>{JSON.stringify(u, undefined, "  ")}</pre>
      ))}

      <ListRowContainer>
        {mockData.map((data) => (
          <ListRow
            key={data.id}
            id={data.id}
            title={data.title}
            status="last_call"
            for={data.for}
            against={data.against}
            noOfComments={data.noOfComments}
            type={data.type}
            href={`/${data.type}`}
          />
        ))}
      </ListRowContainer>
    </>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;
