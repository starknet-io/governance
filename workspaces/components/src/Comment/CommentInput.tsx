import { MarkdownEditor, useMarkdownEditor } from "src/Editor";
import "./comment.css";
import { Button } from "src/Button";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

interface CommentInputProps {
  onSend: (value: string) => void;
  defaultValue?: string;
}
export const CommentInput = ({
  defaultValue = "",
  onSend,
}: CommentInputProps) => {
  const { editorValue, handleEditorChange, convertMarkdownToSlate, editor } =
    useMarkdownEditor(defaultValue);

  const processData = async () => {
    editor.insertNodes(await convertMarkdownToSlate(defaultValue));
  };

  useEffect(() => {
    processData();
  }, []);

  const handleSend = () => {
    onSend(editorValue);
  };

  return (
    <Box mb="16px" position="relative">
      <MarkdownEditor
        basicEditor
        placeholder={"Type your message"}
        onChange={handleEditorChange}
        value={editorValue}
        customEditor={editor}
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
