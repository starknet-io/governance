import { Meta } from "@storybook/react";
import { BannerHome as GovernanceBannerHome } from "./BannerHome";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/BannerHome",
  component: GovernanceBannerHome,
} as Meta<typeof GovernanceBannerHome>;

export const Review = () => (
  <ThemeProvider>
    <GovernanceBannerHome />
  </ThemeProvider>
);
