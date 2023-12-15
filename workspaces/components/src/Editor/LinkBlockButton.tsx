import { useState } from "react";
import { isBlockActive } from "./hotkeys";
import { LinkIcon } from "src/Icons";
import {
  Button,
  IconButton,
  Input,
  Text,
  useToken,
} from "@chakra-ui/react";
import { Editor, Transforms } from "slate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Modal } from "../Modal";

const defaultValues = {
  url: "",
};

const validationSchema = z.object({
  url: z.string(),
});

const LinkBlockButton = ({ editor, format }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);

  const insertLinkBlock = (link: string, linkName: string) => {
    if (!link) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "link",
        link,
        target: "_blank",
        children: [{ text: linkName }],
      },
      { select: true },
    );
  };

  const handleAddLink = () => {
    const selectedText = Editor.string(editor, editor.selection);
    selectedText && setIsOpen(true);
  };

  const handleInsertLink = (data: typeof defaultValues) => {
    setIsOpen(false);
    const selectedText = Editor.string(editor, editor.selection);
    data.url && selectedText && insertLinkBlock(data.url, selectedText);
    reset();
  };

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add link"
        size="md"
      >
        <>
          <Input
            {...register("url")}
            isInvalid
            placeholder="https://www.example.com"
            mt="4"
          />
          {!!errors.url && <Text fontSize="xs" color="red">{errors?.url.message}</Text>}
        </>
        <Modal.Footer>
          <Button p="0" width="100%" onClick={handleSubmit(handleInsertLink)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <IconButton
        aria-label={format}
        size="tb"
        variant="toolbar"
        isActive={isBlockActive(editor, format)}
        onMouseDown={handleAddLink}
        height="100%"
        icon={
          <LinkIcon
            boxSize="20px"
            color={isBlockActive(editor, format) ? activeColor : inactiveColor}
          />
        }
      />
    </>
  );
};

export default LinkBlockButton;
