import {
  Button,
  Input,
  Text,
  useToken,
} from "@chakra-ui/react";
import { Editor, Transforms } from "slate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Modal } from "../Modal";

const validationSchema = z.object({
  url: z.string(),
});

const LinkEditModal = ({ editor, url, selectedText, isOpen, setIsOpen }: any) => {
  const defaultValues = {
    url
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const removeLink = () => {
    const { selection } = editor;
    if (selection) {
      const [linkNode] = Editor.nodes(editor, {
        at: selection,
        match: n => n.type === 'link'
      });

      if (linkNode) {
        Transforms.unwrapNodes(editor, { at: linkNode[1] });
      }
    }
  };

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

  const handleInsertLink = (data: typeof defaultValues) => {
    setIsOpen(false);
    if (data?.url && selectedText) {
      insertLinkBlock(data?.url, selectedText);
    } else {
      removeLink();
    }
    reset();
  };

  return (
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
  );
};

export default LinkEditModal;
