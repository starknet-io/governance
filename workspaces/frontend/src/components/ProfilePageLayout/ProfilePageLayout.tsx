import { Box, Grid } from "@chakra-ui/react";
import { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

const Root = ({ children }: RootProps) => {
  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
        lg: "372px 1fr",
      }}
      templateAreas={{
        base: `
          "profile"
          "about"
          "profilehistory"
        `,
        lg: `
          "profile about"
          "profile profilehistory"
        `,
      }}
    >
      {children}
    </Grid>
  );
};

type ProfileProps = {
  children: ReactNode;
};

const Profile = ({ children }: ProfileProps) => {
  return (
    <Box
      gridArea="profile"
      bg="surface.bgPage"
      borderRight={{ lg: "1px solid" }}
      borderColor={{ lg: "border.forms" }}
    >
      <Box
        position={{ lg: "sticky" }}
        top={{ lg: "68px" }}
        bg="surface.bgPage"
        pt={{ base: "standard.md", lg: "standard.3xl" }}
        pb={{ base: "standard.2xl", lg: "standard.3xl" }}
        px={{
          base: "standard.md",
          md: "standard.xl",
        }}
        // borderBottom="1px solid"
        // borderColor="border.forms"
      >
        {children}
      </Box>
    </Box>
  );
};

type AboutProps = {
  children: ReactNode;
};

const About = ({ children }: AboutProps) => {
  return (
    <Box
      gridArea="about"
      px={{
        base: "standard.md",
        md: "standard.2xl",
      }}
      pt={{ base: "standard.2xl", lg: "standard.3xl" }}
      pb={{ base: "standard.2xl", lg: "standard.3xl" }}
    >
      <Box maxWidth={{ base: "100%", lg: "626px" }} mx="auto">
        {children}
      </Box>
    </Box>
  );
};

type ProfileHistoryProps = {
  children: ReactNode;
};

const ProfileHistory = ({ children }: ProfileHistoryProps) => {
  return (
    <Box
      gridArea="profilehistory"
      px={{
        base: "standard.md",
        md: "standard.2xl",
      }}
      pt={{ base: "standard.2xl", lg: "standard.3xl" }}
      pb={{ base: "standard.2xl", lg: "standard.3xl" }}
    >
      <Box maxWidth={{ base: "100%", lg: "626px" }} mx="auto">
        {children}
      </Box>
    </Box>
  );
};

export { Root, Profile, About, ProfileHistory };
