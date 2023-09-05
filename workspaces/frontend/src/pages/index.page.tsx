import { DocumentProps } from "src/renderer/types";

import { BannerHome, Box, PageTitle } from "@yukilabs/governance-components";

export function Page() {
  return <BannerHome snipCount={1} />;
}

export const documentProps = {
  title: "Home",
} satisfies DocumentProps;
