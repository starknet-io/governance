import { Spinner } from "@chakra-ui/react";
import { useState, FunctionComponent, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { ShareIcon } from "..//Icons";
import { Text } from "../Text";

interface FileUploaderProps {
  handleUpload: (file: File) => Promise<string | void> | void;
  onImageUploaded?: (imageUrl: string) => void;
}

interface FileUploaderProps {
  handleUpload: (file: File) => Promise<string | void> | void;
  onImageUploaded?: (imageUrl: string) => void;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = ({
  handleUpload,
  onImageUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    // Check file type and size
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;

      if (
        !["image/png", "image/jpeg", "image/gif"].includes(fileType) ||
        fileSize > 10 * 1024 * 1024 // 10MB in bytes
      ) {
        console.error("File type or size does not meet the requirements");
        return;
      }
    }

    setFile(selectedFile);
    if (selectedFile) {
      const imageUrl = await handleButtonClick(selectedFile);
      if (imageUrl && onImageUploaded) {
        onImageUploaded(imageUrl);
      }
    }
  };

  const handleButtonClick = async (
    selectedFile: File,
  ): Promise<string | void> => {
    setUploading(true);
    try {
      const imageUrl = await handleUpload(selectedFile); // receive image URL
      return imageUrl;
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".png, .jpg, .jpeg, .gif"
      />
      <Button
        variant={"outline"}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        spinner={<Spinner />}
        leftIcon={uploading ? <Spinner /> : <ShareIcon />}
      >
        <Text>Upload image</Text>
      </Button>
    </div>
  );
};
