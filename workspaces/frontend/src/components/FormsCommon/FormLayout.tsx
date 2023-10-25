import { ReactNode } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
} from "@chakra-ui/react";

type Props = {
  children?: React.ReactNode;
};

export const FormLayout = ({ children }: Props) => {
  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
      }}
      templateAreas={{
        base: `
          "form"
        `,
      }}
    >
      <Box
        gridArea="form"
        px={{
          base: "standard.md",
          md: "standard.2xl",
        }}
        pt={{ base: "standard.2xl", lg: "standard.3xl" }}
        pb={{ base: "standard.2xl", lg: "standard.3xl" }}
        maxWidth="100%"
        overflow={"hidden"}
      >
        <Box maxWidth={{ base: "100%", lg: "670px" }} mx="auto">
          {children}
        </Box>
      </Box>
    </Grid>
  );
};
