import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  ListItem,
  UnorderedList,
  Center,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { HiXMark } from "react-icons/hi2";

type AddressListProps = {
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
};

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  setAddresses,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, inputValue]);
    setInputValue("");
  };

  const handleRemoveAddress = (indexToRemove: number) => {
    setAddresses(
      addresses.filter((_: string, index: number) => index !== indexToRemove)
    );
  };

  return (
    <Box>
      <Box mt={4} border="1px" borderColor="gray.200" borderRadius="md" p={4}>
        {addresses.length === 0 ? (
          <Center>
            <Text>No members yet</Text>
          </Center>
        ) : (
          <UnorderedList styleType="none">
            {addresses.map((address, index) => (
              <ListItem key={index}>
                <Flex justify="space-between" align="center">
                  <Text>{address}</Text>
                  <IconButton
                    aria-label="Delete address"
                    icon={<HiXMark />}
                    variant="ghost"
                    onClick={() => handleRemoveAddress(index)}
                  />
                </Flex>
              </ListItem>
            ))}
          </UnorderedList>
        )}
      </Box>
      <VStack spacing={4}>
        <Input
          placeholder="Enter Ethereum Address"
          value={inputValue}
          onChange={handleInputChange}
          marginTop={6}
        />
        <Button
          onClick={handleAddAddress}
          variant="ghost"
          border="1px solid #E2E8F0"
          borderRadius="none"
          marginRight="auto"
        >
          Add Member
        </Button>
      </VStack>
    </Box>
  );
};
