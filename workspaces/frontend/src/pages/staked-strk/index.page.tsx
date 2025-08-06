import { Box, Flex, Text } from "@chakra-ui/react";
import { PageTitle } from "@yukilabs/governance-components";
import { FormLayout } from "src/components/FormsCommon/FormLayout";
import { EndurIcon } from "src/components/StakedSTRK/EndurIcon";
import { StakePageBox } from "src/components/StakedSTRK/StakePageBox";
import { VoyagerIcon } from "src/components/StakedSTRK/VoyagerIcon";
import { DocumentProps } from "src/renderer/types";

export function Page() {
  const stakingPages = [
    {
      name: "Endur staking dashboard",
      label: "Stake on Endur",
      icon: <EndurIcon />,
      href: "https://dashboard.endur.fi/",
      description: "Stake your STRK on Endur's staking platform",
    },
    {
      name: "Voyager staking dashboard",
      label: "Stake on Voyager",
      icon: <VoyagerIcon />,
      href: "https://voyager.online/staking-dashboard",
      description: "Stake your STRK on Voyager staking platform",
    },
  ];
  return (
    <FormLayout>
      <Box width="100%">
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          gap="standard.xl"
        >
          <PageTitle title="Stake STRK" mb={0} />
        </Flex>

        <Box mb="standard.xl">
          <Text variant="mediumStrong" color="content.support.default">
            Stake on Starknet&apos;s decentralization
          </Text>
        </Box>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap="standard.lg"
          alignItems="stretch"
        >
          {stakingPages.map((stakingPage) => (
            <StakePageBox
              key={stakingPage.name}
              label={stakingPage.label}
              icon={stakingPage.icon}
              href={stakingPage.href}
              description={stakingPage.description}
            />
          ))}
        </Flex>
      </Box>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Stake STRK",
} satisfies DocumentProps;
