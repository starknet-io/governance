import { useMarkdownEditor, MarkdownEditor } from "src/Editor";
import "./comment.css";
import { Button } from "src/Button";
import { Box } from "@chakra-ui/react";

interface CommentInputProps {
  onSend: (value: string) => void;
}
export const CommentInput = ({ onSend }: CommentInputProps) => {
  const { editorValue, handleEditorChange } = useMarkdownEditor("");
  const handleSend = () => {
    onSend(editorValue);
    handleEditorChange([
      {
        type: "paragraph",
        children: [{ text: " " }],
      },
    ]);
  };

  return (
    <Box mb="16px" position="relative">
      <MarkdownEditor
        minHeight="140"
        onChange={handleEditorChange}
        value={editorValue}
        placeholder="Write a comment..."
      />
      <Button
        className="submit-button"
        variant="solid"
        size="sm"
        type="submit"
        onClick={handleSend}
      >
        Send
      </Button>
    </Box>
  );
};
