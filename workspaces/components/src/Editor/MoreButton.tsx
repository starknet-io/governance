import {
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { MoreDotsIcon } from "src/Icons/ToolbarIcons";
import BlockButton from "./BlockButton";
import MarkButton from "./MarkButton";

export function MoreButton() {
  return (
    <Popover placement="top-start">
      <PopoverTrigger>
        <IconButton variant="ghost" size="condensed" aria-label="more">
          <MoreDotsIcon />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent
        width="fit-content"
        border="1px solid border.forms"
        boxShadow="base"
      >
        <Flex p="1" direction="row" alignItems="center">
          <MarkButton format="underline" />
          <MarkButton format="strikeThrough" />
          <BlockButton format="ul_list" />
          <BlockButton format="ol_list" />
          <BlockButton format="block_quote" />
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
