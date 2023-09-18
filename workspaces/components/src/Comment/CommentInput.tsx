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
  defaultValue = "Type your comment",
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

// interface CommentExpandedProps {
//   onSend: (value: string) => void;
// }

// function CommentExpanded({
//   onSend,
//   innerRef,
// }: CommentExpandedProps & { innerRef: React.RefObject<HTMLDivElement> }) {
//   const [editorValue, setEditorValue] = useState<string>("");
//   const handleClick = () => {
//     onSend(editorValue);
//   };
//   return (
//     <motion.div
//       ref={innerRef}
//       layoutId="commentBox"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <QuillEditor
//         onChange={(e) => setEditorValue(e)}
//         value={editorValue}
//         maxLength={10000}
//       />
//       <Button
//         className="submit-button"
//         variant="primary"
//         size="sm"
//         type="submit"
//         onClick={handleClick}
//       >
//         Send
//       </Button>
//     </motion.div>
//   );
// }

// function CompactComment() {
//   return (
//     <motion.div className="container" layoutId="commentBox">
//       <div className="compact-comment">Type your message...</div>
//     </motion.div>
//   );
// }

// export const CommentInput = ({ onSend }: CommentExpandedProps) => {
//   const [isVisible, setIsVisible] = useState<boolean>(true);
//   const commentExpandedRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         commentExpandedRef.current &&
//         !commentExpandedRef.current.contains(event.target as Node)
//       ) {
//         setIsVisible(true);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleClick = () => {
//     if (isVisible) {
//       setIsVisible(false);
//     }
//   };

//   const handleSend = (value: string) => {
//     onSend(value);
//     setIsVisible(true);
//     console.log(isVisible);
//   };

//   return (
//     <div onClick={handleClick}>
//       {isVisible ? (
//         <CompactComment />
//       ) : (
//         <CommentExpanded onSend={handleSend} innerRef={commentExpandedRef} />
//       )}
//     </div>
//   );
// };

// import { MarkdownEditor, useMarkdownEditor } from "src/Editor";
// import "./comment.css";
// import { Button } from "src/Button";
// import { Box } from "@chakra-ui/react";

// interface CommentInputProps {
//   onSend: (value: string) => void;
// }
// export const CommentInput = ({ onSend }: CommentInputProps) => {
//   const { editorValue, handleEditorChange } = useMarkdownEditor({});

//   const handleSend = () => {
//     onSend(editorValue);
//     handleEditorChange({}); // clear the editor after sending
//   };

//   return (
//     <Box mb="16px" position="relative">
//       <MarkdownEditor
//         onChange={(e) => handleEditorChange(e)}
//         value={editorValue}
//         // maxLength={10000}
//         minHeight="86"
//       />
//       <Button
//         className="submit-button"
//         variant="primary"
//         size="sm"
//         type="submit"
//         onClick={handleSend}
//       >
//         Send
//       </Button>
//     </Box>
//   );
// };
