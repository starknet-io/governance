import { DocumentProps } from "src/renderer/types";

import { Box, PageTitle } from "@yukilabs/governance-components";

export function Page() {
  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
      <PageTitle title="Home" />
    </Box>
  );
}

export const documentProps = {
  title: "Home",
} satisfies DocumentProps;
