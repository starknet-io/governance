import { ISearchItem } from "@yukilabs/governance-components/src/GlobalSearch/utils/buildItems";
import algoliasearch from "algoliasearch/lite";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const APP_ID = import.meta.env.VITE_APP_ALGOLIA_APP_ID ?? "";
const PUBLIC_API_KEY = import.meta.env.VITE_APP_ALGOLIA_PUBLIC_API_KEY ?? "";
const INDEX = import.meta.env.VITE_APP_ALGOLIA_INDEX ?? "";

const client = algoliasearch(APP_ID, PUBLIC_API_KEY);
const index = client.initIndex(INDEX);

export const useGlobalSearch = () => {
  const [globalSearchResults, setGlobalSearchResults] = useState<ISearchItem[]>(
    [],
  );

  const debounce = useDebouncedCallback(async (searchText: string) => {
    const { hits } = await index.search(searchText);
    //@ts-expect-error error
    setGlobalSearchResults(hits);
  }, 150);

  const handleGlobalSearchItems = async (searchText: string) => {
    debounce(searchText)
  };

  return {
    globalSearchResults,
    handleGlobalSearchItems,
  };
};
