import { MarkdownEditor, useMarkdownEditor } from "src/Editor";
import "./comment.css";
import { Button } from "src/Button";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

interface CommentInputProps {
  onSend: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
}
export const CommentInput = ({
  defaultValue,
  placeholder = "Type your comment",
  onSend,
}: CommentInputProps) => {
  const {
    editorValue,
    handleEditorChange,
    editor,
    clearEditor,
    setMarkdownValue,
  } = useMarkdownEditor(defaultValue);

  const processData = async () => {
    await setMarkdownValue(defaultValue ?? '');
  };

  useEffect(() => {
    processData();
  }, []);

  const handleSend = () => {
    clearEditor();
    onSend(editorValue);
  };

  return (
    <Box mb="16px" position="relative">
      <MarkdownEditor
        basicEditor
        customEditor={editor}
        placeholder={placeholder}
        onChange={handleEditorChange}
        value={editorValue}
      />

      <Button
        className="submit-button"
        variant="primary"
        size="sm"
        type="submit"
        onClick={handleSend}
      >
        Send
      </Button>
    </Box>
  );
};
