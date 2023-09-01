import {
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Flex,
  Image,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchIcon } from "src/Icons/UiIcons";
import EmptyState from "./assets/img.svg";
import { ISearchItem, buildSearchItems } from "./utils/buildItems";

interface Props {
  searchResults: ISearchItem[];
  onSearchItems: (searchText: string) => void;
}

export function GlobalSearch({ searchResults, onSearchItems }: Props) {
  const [searchText, setSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearchItems(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      setIsSearchModalOpen((condition) => !condition);
    }
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box onClick={handleSearchClick} ml="2">
      <InputGroup>
        <InputLeftElement
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          height="44px"
        >
          <SearchIcon />
        </InputLeftElement>
        <Input
          placeholder="Search"
          backgroundColor="white"
          width="238px"
          height="44px"
          pointerEvents="none"
        />
        <InputRightElement height="44px">
          <Box
            width="28px"
            height="28px"
            backgroundColor="#23192D1A"
            borderRadius="base"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="500">/</Text>
          </Box>
        </InputRightElement>
      </InputGroup>

      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        autoFocus={false}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent height="672px" borderRadius="lg">
          <ModalHeader p="0" borderBottom="1px solid #23192D1A">
            <Input placeholder="YPO" hidden/>
            <InputGroup>
              <InputLeftElement height="60px">
                <SearchIcon />
              </InputLeftElement>
              <Input
                outline="none"
                border="none"
                height="60px"
                placeholder="Search"
                autoFocus={false}
                value={searchText}
                onChange={handleSearchTextChange}
              />
            </InputGroup>
          </ModalHeader>

          {!!searchResults.length && (
            <ModalBody overflowY="scroll">
              {buildSearchItems(searchResults, "grouped-items")}
            </ModalBody>
          )}

          {!searchResults.length && (
            <ModalBody
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Flex flexDirection="column" alignItems="center">
                <Image
                  maxWidth="280px"
                  maxHeight="280px"
                  aspectRatio="1/1"
                  src={EmptyState}
                />
                <Text mt="2" fontWeight="semibold">
                  No data to display
                </Text>
                <Text mt="2" fontSize="small" fontWeight="semibold">
                  Apply different filters or criteria to find the data
                  you&apos;re looking for.
                </Text>
              </Flex>
            </ModalBody>
          )}

          <ModalFooter borderTop="1px solid #23192D1A">
            <Flex>
              <Flex mr="6">
                <Flex mr="2">
                  <Box
                    mr="1"
                    border="1px solid #23192D1A"
                    borderRadius="base"
                    width="5"
                    height="5"
                  >
                    <ArrowUpIcon />
                  </Box>
                  <Box
                    border="1px solid #23192D1A"
                    borderRadius="base"
                    width="5"
                    height="5"
                  >
                    <ArrowDownIcon />
                  </Box>
                </Flex>
                <Text fontSize="small" fontWeight="medium" color="#86848D">
                  to navigate
                </Text>
              </Flex>
              <Flex>
                <Box mr="2" border="1px solid #23192D1A" borderRadius="base">
                  <Text
                    fontWeight="semibold"
                    px="1.5"
                    fontSize="xs"
                    lineHeight="20px"
                  >
                    Enter
                  </Text>
                </Box>
                <Text fontSize="small" fontWeight="medium" color="#86848D">
                  to select
                </Text>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
