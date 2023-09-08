import { DocumentProps } from "src/renderer/types";

import { BannerHome, Box, PageTitle } from "@starknet-foundation/governance-ui";

export function Page() {
  return <BannerHome snipCount={1} />;
}

export const documentProps = {
  title: "Home",
} satisfies DocumentProps;
