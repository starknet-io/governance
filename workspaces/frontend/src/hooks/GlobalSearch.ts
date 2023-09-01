import { ISearchItem } from "@yukilabs/governance-components/src/GlobalSearch/utils/buildItems";
import algoliasearch from "algoliasearch/lite";
import { useState } from "react";

const APP_ID = process.env.VITE_APP_ALGOLIA_APP_ID ?? "";
const PUBLIC_API_KEY = process.env.VITE_APP_ALGOLIA_PUBLIC_API_KEY ?? "";
const INDEX = process.env.VITE_APP_ALGOLIA_INDEX ?? "";

const client = algoliasearch(APP_ID, PUBLIC_API_KEY);
const index = client.initIndex(INDEX);

export const useGlobalSearch = () => {
  const [globalSearchResults, setGlobalSearchResults] = useState<ISearchItem[]>([]);

  const handleGlobalSearchItems = async (searchText: string) => {
    const { hits } = await index.search(searchText);
    //@ts-expect-error error
    setGlobalSearchResults(hits);
  };

  return {
    globalSearchResults,
    handleGlobalSearchItems,
  };
};
