import { Box, Button, Text, Spinner, VStack, Flex } from "@chakra-ui/react";
import React, { useMemo, CSSProperties, useState, useEffect } from "react";
import * as ReactDropzone from "react-dropzone";
const { useDropzone } = ReactDropzone;
import { IconButton } from "src/IconButton";
import { ImageIcon, ImageWarningIcon, TrashIcon } from "src/Icons";

const thumbsContainer: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  borderRadius: "10px",
};

const img: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 1,
  borderRadius: 10,
  borderColor: "#23192D1A",
  borderStyle: "solid",
  backgroundColor: "#FBFBFB",
  color: "#4A4A4F",
  outline: "none",
  transition: "border .24s ease-in-out",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "20px",
  boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.1)",
};

const focusedStyle: CSSProperties = {
  borderColor: "#C8C7CB",
};

const acceptStyle: CSSProperties = {
  borderColor: "#C8C7CB",
};

const rejectStyle: CSSProperties = {
  borderColor: "#ff1744",
};

type PreviewFile = File & { preview: string };

interface UploadImageProps {
  onImageSelected?: (selectedFile: File) => void;
  loading?: boolean;
  closeModal?: () => void;
}

export const UploadImage: React.FC<UploadImageProps> = ({
  onImageSelected,
  loading = false,
  closeModal,
}) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [fileTooLarge, setFileTooLarge] = useState(false);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles[0]?.size > 5 * 1024 * 1024) {
          // 5 MB
          setFileTooLarge(true);
          return;
        }
        setFileTooLarge(false);
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject || fileTooLarge ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject, fileTooLarge],
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const handleDelete = (fileToDelete: PreviewFile) => {
    setFiles(files.filter((file) => file !== fileToDelete));
  };

  const thumbs = files.map((file) => (
    <Box
      key={file.name}
      borderRadius="12px"
      mb={2}
      mr={2}
      width="100%"
      position="relative"
    >
      <img
        src={file.preview}
        style={img}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />

      <Flex
        position="absolute"
        bottom={0}
        width="100%"
        backgroundColor="rgba(0, 0, 0, 0.15)"
        justifyContent="space-between"
        alignItems="center"
        p={1}
        backdropFilter={"blur(3px)"}
        borderBottomLeftRadius={"10px"}
        borderBottomRightRadius={"10px"}
      >
        <Box display={"flex"}>
          <ImageIcon boxSize="18px" />
          <Text pl={1} color="#1A1523" fontSize={"12px"} fontWeight={"600"}>
            {file.name}
          </Text>
        </Box>
        <IconButton
          aria-label="Delete image"
          icon={<TrashIcon color={"#1A1523"} />}
          variant="ghost"
          onClick={() => handleDelete(file)}
        />
      </Flex>
    </Box>
  ));

  const handleSave = () => {
    if (files.length > 0) {
      onImageSelected && onImageSelected(files[0]);
    }
  };

  return (
    <Box className="container">
      {files.length === 0 ? (
        <Box>
          <VStack
            {...getRootProps()}
            className="dropzone"
            borderWidth="2px"
            borderRadius="md"
            p="4"
            width="full"
            alignItems="center"
            style={style}
            _hover={{ cursor: "pointer" }}
          >
            <input {...getInputProps()} accept=".png, .jpg, .jpeg, .gif" />
            <Text>
              Drag &#39;n&#39; drop file here, or click to select file
            </Text>
            <Text fontSize="sm" color="#86848D">
              PNG, JPG or GIF (max. 5 MB)
            </Text>
          </VStack>
          {fileTooLarge && (
            <Box display={"flex"} alignItems="center">
              <ImageWarningIcon mt={2} boxSize={"20px"} />
              <Text color="#ff1744" fontSize={"12px"}>
                The file is too large, please select a file less than 5 MB.
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box style={thumbsContainer}>{thumbs}</Box>
      )}
      <Box display={"flex"} justifyContent={"space-between"}>
        <Button width={"50%"} variant={"ghost"} mt={4} onClick={closeModal}>
          <Text>Discard</Text>
        </Button>
        <Button
          width={"50%"}
          onClick={handleSave}
          disabled={loading || files.length === 0}
          leftIcon={loading ? <Spinner /> : <></>}
          mt={4}
          ml={4}
        >
          <Text>Save Changes</Text>
        </Button>
      </Box>
    </Box>
  );
};
