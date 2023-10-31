import { Box, Grid } from "@chakra-ui/react";
import { Delegates } from "src/components/Delegates";
import { DocumentProps } from "src/renderer/types";

export const Page = () => {
  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
      }}
      templateAreas={{
        base: `
          "listcontent"
        `,
      }}
    >
      <Box
        gridArea="listcontent"
        px={{
          base: "standard.md",
          md: "standard.2xl",
        }}
        pt={{ base: "standard.2xl", lg: "standard.3xl" }}
        pb={{ base: "standard.2xl", lg: "standard.3xl" }}
      >
        <Box maxWidth={{ base: "100%", lg: "1240px" }} mx="auto">
          <Delegates />
        </Box>
      </Box>
    </Grid>
  );
};

export const documentProps = {
  title: "Delegates",
  image: "/social/social-delegates.png",
} satisfies DocumentProps;
