import {
  Alert,
  AlertDescription,
  AlertProps,
  Box,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { IconButton } from "src/IconButton";
import { InfoIcon, XIcon, DocumentFileWarning, CommentHidden } from "src/Icons";
type Props = {
  type?: "info" | "pending" | "error" | "commentHidden";
  variant?: "info" | "error" | "commentHidden";
  label: string;
  onClose?: () => void;
} & AlertProps;

export const Banner = ({
  label,
  onClose,
  type = "info",
  variant = "info",
  ...rest
}: Props) => {
  return (
    <Alert variant={variant} flexDirection="row" gap="standard.sm" {...rest}>
      {type === "info" && <Icon color="#1A1523" as={InfoIcon} />}
      {type === "pending" && <Spinner size="sm" />}
      {type === "error" && <Icon as={DocumentFileWarning} />}
      {type === "commentHidden" && <Icon as={CommentHidden} />}

      <AlertDescription pr={onClose && "standard.2xl"}>
        {label}
      </AlertDescription>
      {onClose && (
        <Box position="absolute" right="0" top="0">
          <IconButton
            onClick={onClose}
            color="#4A4A4F"
            aria-label="close"
            variant="ghost"
            icon={<XIcon />}
          />
        </Box>
      )}
    </Alert>
  );
};
