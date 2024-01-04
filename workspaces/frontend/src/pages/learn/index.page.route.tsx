import { resolveRoute } from "vike/routing";

export default (pageContext: any) => {
  if (pageContext.urlPathname === "/learn") {
    return resolveRoute("/learn", pageContext.urlPathname);
  }
  return resolveRoute("/learn/@slug", pageContext.urlPathname);
};
