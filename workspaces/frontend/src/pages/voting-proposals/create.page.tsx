import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  InputGroup,
  InputLeftAddon,
  QuillEditor,
  EditorTemplate,
  DatePicker,
  ContentContainer,
} from "@yukilabs/governance-components";
import { useState } from "react";

export function Page() {
  const [editorValue, setEditorValue] = useState<string>(
    EditorTemplate.proposal
  );
  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create voting proposal
          </Heading>
          <Stack spacing="32px" direction={{ base: "column" }}>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input
                variant="primary"
                placeholder="Briefly describe proposal"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="delegate-statement">
              <FormLabel>Proposal Body</FormLabel>
              <QuillEditor
                onChange={(e) => setEditorValue(e)}
                value={editorValue}
              />
            </FormControl>
            <FormControl id="starknet-type">
              <FormLabel>Forum discussion (optional) </FormLabel>

              <InputGroup maxW={{ md: "3xl" }}>
                <InputLeftAddon>https://</InputLeftAddon>
                <Input
                  variant="primary"
                  defaultValue="community.starknet.io/1234567890"
                />
              </InputGroup>
            </FormControl>

            {/* // disabled for basic voting */}
            <FormControl id="starknet-wallet-address">
              <FormLabel>Voting type</FormLabel>
              <Select
                placeholder="Select option"
                disabled
                defaultValue="option1"
              >
                <option value="option1">Basic</option>
              </Select>
            </FormControl>
            {/* // disabled for basic voting */}
            <FormControl id="Choices">
              <FormLabel>Choices</FormLabel>
              <Stack spacing="12px" direction={{ base: "column" }}>
                <Box
                  border="1px solid #E4E5E7 "
                  padding="10px 15px"
                  borderRadius="5px"
                >
                  For
                </Box>
                <Box
                  border="1px solid #E4E5E7 "
                  padding="10px 15px"
                  borderRadius="5px"
                >
                  Against
                </Box>
                <Box
                  border="1px solid #E4E5E7 "
                  padding="10px 15px"
                  borderRadius="5px"
                >
                  Abstain
                </Box>
              </Stack>
            </FormControl>
            <FormControl id="starknet-wallet-address">
              <FormLabel>Voting period</FormLabel>
              <Stack spacing="12px" direction={{ base: "row" }}>
                <Box width="100%">
                  <DatePicker
                    id="published-date"
                    selectedDate={new Date()}
                    onChange={(date) => console.log(date)}
                    showPopperArrow={true}
                  />
                </Box>
                <Box width="100%">
                  <DatePicker
                    id="published-date"
                    selectedDate={new Date()}
                    onChange={(date) => console.log(date)}
                    showPopperArrow={true}
                  />
                </Box>
              </Stack>
            </FormControl>
            <Box display="flex" justifyContent="flex-end">
              <Button variant={"solid"}>Create voting proposal</Button>
            </Box>
          </Stack>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Vote / Create",
} satisfies DocumentProps;
