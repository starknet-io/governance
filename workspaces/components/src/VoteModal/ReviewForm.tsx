import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Stack,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdThumbUp } from "react-icons/md";

export const ReviewForm = (props: React.ComponentProps<"form">) => (
  <form {...props}>
    <Stack spacing="6">
      <Box
        fontSize="14px"
        bg="#FAFAFA"
        p="16px"
        border="1px solid #E4E5E7"
        borderRadius="8px"
        color="#6C6C75"
      >
        Voting <Icon mx="4px" color="#20AC70" as={MdThumbUp} /> with 7m votes
      </Box>
      <FormControl id="comment">
        <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
          Reason for vote (optional)
        </FormLabel>

        <Textarea
          variant="primary"
          name="comment"
          placeholder="I voted X because Y"
          rows={4}
          focusBorderColor={useColorModeValue("blue.500", "blue.200")}
          resize="none"
        />
      </FormControl>
    </Stack>
  </form>
);
