import { MarkdownEditor, useMarkdownEditor } from "#src/Editor";
import "./comment.css";
import { Button } from "#src/Button";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

interface CommentInputProps {
  onSend: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  onCancel?: () => void;
  withCancel?: boolean;
  isEdit?: boolean;
}
export const CommentInput = ({
  defaultValue,
  withCancel,
  onCancel,
  placeholder = "Type your comment",
  onSend,
  isEdit,
}: CommentInputProps) => {
  const {
    editorValue,
    handleEditorChange,
    editor,
    clearEditor,
    setMarkdownValue,
  } = useMarkdownEditor(defaultValue);

  const processData = async () => {
    await setMarkdownValue(defaultValue ?? "");
  };

  useEffect(() => {
    processData();
  }, []);

  const handleSend = () => {
    clearEditor();
    onSend(editorValue);
  };

  const isSendDisabled = !editorValue?.trim?.() || editorValue === defaultValue

  return (
    <Box mb="16px" position="relative">
      <MarkdownEditor
        basicEditor
        customEditor={editor}
        placeholder={placeholder}
        onChange={handleEditorChange}
        value={editorValue}
        initialValue={defaultValue ? [] : undefined}
      />
      {withCancel && (
        <Button
          className="cancel-button"
          variant="ghost"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
      )}
      <Button
        className="submit-button"
        variant="primary"
        onClick={handleSend}
        disabled={isSendDisabled}
        marginLeft="standard.base"
      >
        {isEdit ? "Save" : "Send"}
      </Button>
    </Box>
  );
};
