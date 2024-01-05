import { HStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import {
  IconButton as GovernanceIconButton,
  IconButtonWithBadge,
} from "./IconButton";
import { ThemeProvider } from "../ThemeProvider";

import {
  BoldIcon,
  ItalicIcon,
  StrikeThroughIcon,
} from "../Icons/ToolbarIcons";
import { FiltersIcon } from "../Icons";

export default {
  title: "governance-ui/Button/IconButton",
  component: GovernanceIconButton,
} as Meta<typeof GovernanceIconButton>;

export const IconButton = () => (
  <ThemeProvider>
    <HStack>
      <GovernanceIconButton
        variant="primary"
        size="standard"
        icon={<BoldIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="secondary"
        size="standard"
        icon={<BoldIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="outline"
        size="standard"
        icon={<StrikeThroughIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="ghost"
        size="standard"
        icon={<StrikeThroughIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="danger"
        size="standard"
        icon={<ItalicIcon />}
        aria-label="Icon button"
      />
      <IconButtonWithBadge
        badgeContent={1}
        variant="outline"
        size="withBadgeStandard"
        icon={<FiltersIcon />}
        aria-label="Icon button"
      />
    </HStack>
    <HStack mt="32px">
      <GovernanceIconButton
        variant="primary"
        size="condensed"
        icon={<BoldIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="secondary"
        size="condensed"
        icon={<BoldIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="outline"
        size="condensed"
        icon={<StrikeThroughIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="ghost"
        size="condensed"
        icon={<StrikeThroughIcon />}
        aria-label="Icon button"
      />
      <GovernanceIconButton
        variant="danger"
        size="condensed"
        icon={<ItalicIcon />}
        aria-label="Icon button"
      />
      <IconButtonWithBadge
        badgeContent={1}
        variant="outline"
        size="withBadgeCondensed"
        icon={<FiltersIcon />}
        aria-label="Icon button"
      />
    </HStack>
  </ThemeProvider>
);
