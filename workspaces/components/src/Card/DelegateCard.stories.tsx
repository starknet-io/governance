import { HStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { DelegateCard as GovernanceDelegateCard } from "./DelegateCard";
import { ThemeProvider } from "../ThemeProvider";
import { truncateAddress } from "..//utils";

export default {
  title: "governance-ui/Cards",
  component: GovernanceDelegateCard,
} as Meta<typeof GovernanceDelegateCard>;

export const DelegateCard = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <GovernanceDelegateCard
          statement="This is my statement lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam faucibus, quam quam aliquet elit, vitae."
          type={[
            "Starknet community",
            "infrastructure_starknet_dev",
            "web3_developer",
            "web3_community",
          ]}
          votingPower={0}
          onDelegateClick={() => console.log("Delegate clicked")}
          address={"0xw33242342342342342342342342342342342342343"}
          src="https://pbs.twimg.com/profile_images/1571999433046237185/j9ktCKhD_400x400.jpg"
          user="robwalsh.eth"
        />
        <GovernanceDelegateCard
          statement="This is my statement lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam faucibus, quam quam aliquet elit, vitae."
          type={["Starknet community"]}
          votingPower={0}
          onDelegateClick={() => console.log("Delegate clicked")}
          profileURL="https://example.com/profile"
          address={"0xw33242342342342342342342342342342342342343"}
          src={null}
          user={truncateAddress("0xw33242342342342342342342342342342342342343")}
        />
      </>
    </HStack>
  </ThemeProvider>
);
