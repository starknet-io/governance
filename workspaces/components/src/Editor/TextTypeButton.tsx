import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToken,
  Text,
} from "@chakra-ui/react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "./hotkeys";
import { ExpandIcon, TextTypeIcon } from "src/Icons/ToolbarIcons";
import { CustomParagraphTypes } from "./ElementLeaf";

export function TextTypeButton({ format = "heading_one" }) {
  const editor = useSlate();
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);

  return (
    <Menu placement="top-start">
      {({ isOpen }) => (
        <>
          <MenuButton _hover={{ backgroundColor: "white" }} type="button">
            <IconButton
              aria-label={format}
              variant="ghost"
              size="condensed"
              isActive={isBlockActive(editor, format)}
              icon={
                <Flex alignItems="center">
                  <TextTypeIcon
                    boxSize="20px"
                    color={
                      isBlockActive(editor, format)
                        ? activeColor
                        : inactiveColor
                    }
                  />
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
