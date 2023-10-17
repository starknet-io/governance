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
  Show,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CloseIcon, SearchIcon } from "src/Icons/UiIcons";
import EmptyState from "./assets/img.svg";
import {
  ISearchItem,
  buildSearchItems,
  getSearchItemHref,
} from "./utils/buildItems";
import { navigate } from "vite-plugin-ssr/client/router";

interface Props {
  isOpen?: boolean;
  searchResults: ISearchItem[];
  onSearchItems: (searchText: string) => void;
  setIsSearchModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function GlobalSearch({
  searchResults,
  onSearchItems,
  isOpen = false,
  setIsSearchModalOpen,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const h = searchResults?.[highlightIndex];

  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearchItems(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      setIsSearchModalOpen((condition) => !condition);
    }

    if (e.key === "ArrowDown") {
      console.log("ArrowDown");
      setHighlightIndex((i) => (i + 1 === searchResults.length ? i : i + 1));
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => (i > 0 ? i - 1 : i));
    }

    if (e.key === "Enter") handleEnterPress();
  };

  const handleEnterPress = () => {
    if (h) {
      let path = getSearchItemHref(h?.type, h?.refID);
      setIsSearchModalOpen(false);
      if (h?.type === "delegate") {
        path = path.replace("/delegates/", "/delegates/profile/");
      }
      navigate(path);
    }
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  // Using setTimeout here to remove "/" upon clicking it
  useEffect(() => {
    setTimeout(() => {
      isOpen && setSearchText("");
    }, 10);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window?.screen?.width < 567;

  return (
    <Box onClick={handleSearchClick} ml="2">
      <Show breakpoint="(min-width: 567px)">
        <InputGroup>
          <InputLeftElement
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
            height="36px"
          >
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search"
            backgroundColor="white"
            width="238px"
            height="36px"
            pointerEvents="none"
            paddingLeft="2.5rem"
          />
          <InputRightElement height="36px">
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
      </Show>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsSearchModalOpen(false)}
        autoFocus={false}
        size={isMobile ? "full" : "3xl"}
      >
        <ModalOverlay />
        <ModalContent height="672px" borderRadius="lg">
          <ModalHeader p="0" borderBottom="1px solid #23192D1A">
            <Input placeholder="" hidden />
            <InputGroup>
              <InputLeftElement height="60px" pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                outline="none"
                border="none"
                height="60px"
                placeholder="Search"
                autoFocus={true}
                value={searchText}
                onChange={handleSearchTextChange}
                paddingLeft="2.5rem"
              />
              <Show breakpoint="(max-width: 567px)">
                <InputRightElement onClick={() => setIsSearchModalOpen(false)}>
                  <CloseIcon />
                </InputRightElement>
              </Show>
            </InputGroup>
          </ModalHeader>

          {!!searchResults.length && (
            <ModalBody overflowY="scroll">
              {buildSearchItems(searchResults, "grouped-items", h)}
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

          <Show breakpoint="(min-width: 567px)">
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
          </Show>
        </ModalContent>
      </Modal>
    </Box>
  );
}
