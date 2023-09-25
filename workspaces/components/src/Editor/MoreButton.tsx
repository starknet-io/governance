import { IconButton } from "@chakra-ui/react";
import { MoreDotsIcon } from "src/Icons/ToolbarIcons";

/* 
<MarkButton format="strikeThrough" />
<BlockButton format="heading_one" />
<BlockButton format="heading_two" />
<BlockButton format="block_quote" />
<BlockButton format="ul_list" />
<BlockButton format="ol_list" />
<MarkButton format="underline" />
*/

export function MoreButton() {
  return (
    <IconButton variant="ghost" size="condensed" aria-label="more">
      <MoreDotsIcon />
    </IconButton>
  );
}
