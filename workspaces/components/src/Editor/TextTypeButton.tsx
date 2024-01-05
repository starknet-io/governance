import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "./hotkeys";
import { ExpandIcon, TextTypeIcon } from "../Icons/ToolbarIcons";
import { CustomParagraphTypes } from "./ElementLeaf";

export function TextTypeButton({ format = "heading_one" }) {
  const editor = useSlate();
  return (
    <Menu placement="top-start">
      {({ isOpen }) => (
        <>
          <MenuButton
            backgroundColor="transparent"
            _hover={{ backgroundColor: "transparent" }}
            type="button"
          >
            <IconButton
              aria-label={format}
              variant="ghost"
              size="condensed"
              isActive={isBlockActive(editor, format)}
              pl="1"
              icon={
                <Flex alignItems="center">
                  <TextTypeIcon boxSize="20px" />
                  <ExpandIcon
                    transform={`rotate(${isOpen ? "180deg" : "0"})`}
                  />
                </Flex>
              }
            />
          </MenuButton>
          <MenuList backgroundColor="surface.forms.default">
            <MenuItem
              onClick={() =>
                toggleBlock(editor, "heading_one" as CustomParagraphTypes)
              }
              backgroundColor="surface.forms.default"
            >
              <Text fontSize="lg" fontWeight="bold">
                Heading 1
              </Text>
            </MenuItem>
            <MenuItem
              onClick={() =>
                toggleBlock(editor, "heading_two" as CustomParagraphTypes)
              }
              backgroundColor="surface.forms.default"
            >
              <Text fontWeight="bold">Heading 2</Text>
            </MenuItem>
            <MenuItem
              onClick={() =>
                toggleBlock(editor, "paragraph" as CustomParagraphTypes)
              }
              backgroundColor="surface.forms.default"
            >
              <Text fontSize="sm"> Normal text</Text>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
}
