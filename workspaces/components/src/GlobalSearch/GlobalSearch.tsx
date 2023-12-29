import { useRef } from "react";
import {
  Box,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Flex,
  Image,
  Show,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { CloseIcon, SearchIcon } from "src/Icons/UiIcons";
import EmptyState from "./assets/no-data-found.png";
import {
  ISearchItem,
  buildSearchItems,
  getSearchItemHref,
} from "./utils/buildItems";
import { navigate } from "vite-plugin-ssr/client/router";
import { Input } from "src/Input";
import usePopulateProposals from "./utils/usePopulateProposals";
import { Modal } from "../Modal";

interface Props {
  isOpen?: boolean;
  searchResults: ISearchItem[];
  onSearchItems: (searchText: string) => void;
  onGlobalSearchOpen: () => void;
  onGlobalSearchClose: () => void;
}

export function GlobalSearch({
  searchResults,
  onSearchItems,
  isOpen = false,
  onGlobalSearchOpen,
  onGlobalSearchClose,
}: Props) {
  const [searchResultsState, setSearchResultsState] = useState(searchResults);
  useEffect(() => {
    setSearchResultsState(searchResults);
  }, [searchResults])
  const searchResultsStateRef = useRef(searchResultsState);
  searchResultsStateRef.current = searchResultsState;
  const [searchText, setSearchText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const highlightIndexRef = useRef(highlightIndex);
  highlightIndexRef.current = highlightIndex;
  const populatedSearchResults = usePopulateProposals(searchResultsState);

  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearchItems(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      const activeElement = document.activeElement;
      const tagName = activeElement?.tagName.toLowerCase();
      if ((activeElement?.role !== 'textbox' && tagName !== 'input' && tagName !== 'textarea') || activeElement?.parentElement?.parentElement?.tagName?.toLowerCase() === "header") {
        if (isOpen) {
          onGlobalSearchClose();
        } else {
          onGlobalSearchOpen();
        }
      }
    }

    if (e.key === "ArrowDown") {
      setHighlightIndex((i) => {
        return i + 1 === searchResultsStateRef.current.length ? i : i + 1;
      });
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => (i > 0 ? i - 1 : i));
    }

    if (e.key === "Enter") handleEnterPress();
  };

  const handleEnterPress = () => {
    if (searchResultsStateRef.current?.[highlightIndexRef.current]) {
      let path = getSearchItemHref(searchResultsStateRef.current?.[highlightIndexRef.current]?.type, searchResultsStateRef.current?.[highlightIndexRef.current]?.refID, searchResultsStateRef.current?.[highlightIndexRef.current]?.name);
      onGlobalSearchClose();
      if (searchResultsStateRef.current?.[highlightIndexRef.current]?.type === "delegate") {
        path = path.replace("/delegates/", "/delegates/profile/");
      }
      window.location.href = path;
    }
  };

  const handleSearchClick = () => {
    onGlobalSearchOpen();
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

  const { isMobile, isTablet } = useIsMobile();

  return (
    <Box onClick={handleSearchClick} cursor="pointer">
      <InputGroup
        color="content.support.default"
        _hover={{
          color: "content.support.hover",
        }}
      >
        <InputLeftElement
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          height={isTablet ? "44px" : "36px"}
          width="auto"
          pl="standard.sm"
          color="inherit"
        >
          <SearchIcon color="currentColor" width="20px" height="20px" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          width={isTablet ? "100%" : "237px"}
          height={isTablet ? "44px" : "36px"}
          pointerEvents="none"
          paddingLeft="calc(12px + 20px + 8px)" // icon left p 12px, 20px icon width, 8px gap
          borderRadius="4px"
          _groupHover={{
            _placeholder: {
              color: "content.support.hover",
            },
          }}
        />
        {!isTablet ? <InputRightElement
          width="32px"
          borderRadius="4px"
          overflow="hidden"
          top="2px"
          height="32px"
          right="2px"
          pointerEvents="none"
        >
          <Box
            position="relative"
            height="32px"
            p="standard.xs"
            backgroundColor="surface.overlay"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="4px"
          >
            <Text
              fontSize="16px"
              lineHeight={1}
              color="inherit"
              fontWeight="500"
              w="16px"
              textAlign="center"
            >
              /
            </Text>
          </Box>
        </InputRightElement> : null}
      </InputGroup>

      <Modal
        isOpen={isOpen}
        onClose={onGlobalSearchClose}
        size={isMobile ? "full" : "3xl"}
        maxHeight="100%"
      >
        <Flex
          height={isMobile ? "100vh" : "672px"}
          overflow="auto"
          borderRadius="lg"
          direction="column"
        >
          <ModalHeader mt={isMobile ? "60px" : "0"} p="0" borderBottom="1px solid #23192D1A">
            <Input placeholder="" hidden />
            <InputGroup
              color="content.support.default"
              _hover={{
                color: "content.support.hover",
              }}
              _focus={{
                color: "content.support.hover",
              }}
              _focusWithin={{
                color: "content.support.hover",
              }}
            >
              <InputLeftElement height="60px" pointerEvents="none">
                <SearchIcon color="currentColor" />
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
                <InputRightElement onClick={onGlobalSearchClose}>
                  <CloseIcon />
                </InputRightElement>
              </Show>
            </InputGroup>
          </ModalHeader>

          {!!searchResultsState.length && (
            <ModalBody overflowY="scroll" pb="0" px="0px" pt="standard.xs">
              {buildSearchItems(populatedSearchResults, "grouped-items", searchResultsState?.[highlightIndex])}
            </ModalBody>
          )}

          {!searchResultsState.length && (
            <ModalBody
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Flex
                flexDirection="column"
                alignItems="center"
                gap="standard.xs"
                color="content.default.default"
              >
                <Image maxWidth="280px" maxHeight="232px" src={EmptyState} />
                <Text fontWeight="semibold">No data to display</Text>
              </Flex>
            </ModalBody>
          )}

          <Show breakpoint="(min-width: 567px)">
            <ModalFooter
              borderTop="1px solid #23192D1A"
              py="standard.sm"
              px="standard.xl"
            >
              <Flex gap="standard.xl">
                <Flex gap="standard.xs">
                  <Flex gap="standard.base">
                    <Box border="1px solid #23192D1A" borderRadius="base">
                      <ArrowUpIcon width="20px" height="20px" />
                    </Box>
                    <Box border="1px solid #23192D1A" borderRadius="base">
                      <ArrowDownIcon width="20px" height="20px" />
                    </Box>
                  </Flex>
                  <Text fontSize="small" fontWeight="medium" color="#86848D">
                    to navigate
                  </Text>
                </Flex>
                <Flex gap="standard.xs">
                  <Box border="1px solid #23192D1A" borderRadius="base">
                    <Text
                      fontWeight="semibold"
                      px="1.5"
                      fontSize="xs"
                      lineHeight="20px"
                      color="content.default.default"
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
        </Flex>
      </Modal>
    </Box>
  );
}
