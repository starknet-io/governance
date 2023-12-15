import { isBlockActive } from "./hotkeys";
import { ImageIcon } from "src/Icons";
import {
  IconButton,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { Transforms } from "slate";
import { UploadImage } from "../UploadImage";
import { useState } from "react";
import { Modal } from "../Modal";

interface ImageBlockButtonProps {
  editor: any;
  format?: any;
  handleUpload?: (file: File) => Promise<string | void> | void;
}

const ImageBlockButton: React.FC<ImageBlockButtonProps> = ({
  editor,
  format,
  handleUpload,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);
  const [loading, setLoading] = useState(false);

  const insertImageBlock = (link: string) => {
    if (!link) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "image",
        caption: "image",
        link,
        children: [{ text: "" }],
      },
      { select: true },
    );
    Transforms.insertNodes(editor, {
      //@ts-expect-error error
      type: "paragraph",
      children: [{ text: "" }],
    });
  };

  const handleImageSelected = async (selectedFile: File) => {
    try {
      setLoading(true);
      const imageUrl = await handleUpload?.(selectedFile);
      if (typeof imageUrl !== "string") {
        throw new Error("Invalid image URL returned.");
      }
      setLoading(false);
      insertImageBlock(imageUrl);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label={format}
        size="condensed"
        variant="toolbar"
        isActive={isBlockActive(editor, format)}
        icon={
          <ImageIcon
            boxSize="20px"
            color={isBlockActive(editor, format) ? activeColor : inactiveColor}
          />
        }
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Upload Image"
        size="md"
      >
        <UploadImage
          onImageSelected={handleImageSelected}
          loading={loading}
          closeModal={onClose}
        />
      </Modal>
    </>
  );
};

export default ImageBlockButton;
