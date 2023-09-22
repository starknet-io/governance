import { isBlockActive } from "./hotkeys";
import { ImageIcon } from "src/Icons";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { Transforms } from "slate";
import { UploadImage } from "../UploadImage";
import { useState } from "react";

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
  // const insertImageBlock = (link: string) => {
  //   if (!link) return;

  //   Transforms.insertNodes(
  //     editor,
  //     {
  //       //@ts-expect-error error
  //       type: "image",
  //       caption: "image",
  //       link,
  //       children: [{ text: "" }],
  //     },
  //     { select: true },
  //   );
  //   Transforms.insertNodes(editor, {
  //     //@ts-expect-error error
  //     type: "paragraph",
  //     children: [{ text: "" }],
  //   });
  // };

  const insertLinkBlock = (link: string) => {
    if (!link) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "link",
        link,
        target: "_blank",
        children: [{ text: link }],
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
      insertLinkBlock(imageUrl);
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
            boxSize="18px"
            color={isBlockActive(editor, format) ? activeColor : inactiveColor}
          />
        }
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            Upload Image
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UploadImage
              onImageSelected={handleImageSelected}
              loading={loading}
              closeModal={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageBlockButton;
