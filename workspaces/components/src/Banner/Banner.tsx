import {
  Alert,
  AlertDescription,
  AlertProps,
  Box,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { IconButton } from "src/IconButton";
import { InfoIcon, XIcon } from "src/Icons";
type Props = {
  type?: "info" | "pending";
  label: string;
  onClose?: () => void;
} & AlertProps;

export const Banner = ({ label, onClose, type = "info", ...rest }: Props) => {
  return (
    <Alert variant="info" flexDirection="row" gap="standard.sm" {...rest}>
      {type === "info" && <Icon color="#1A1523" as={InfoIcon} />}
      {type === "pending" && <Spinner size="sm" />}

      <AlertDescription pr={onClose && "standard.sm"}>{label}</AlertDescription>
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
