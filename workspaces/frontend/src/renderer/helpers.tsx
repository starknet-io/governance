import { PageContextServer } from "./types";

const defaultLocale = "en";

type DefaultPageContextKeys = "locale";

export async function getDefaultPageContext(
  pageContext: PageContextServer
): Promise<Pick<PageContextServer, DefaultPageContextKeys>> {
  const locale = pageContext.locale ?? defaultLocale;

  return {
    locale,
  };
}
