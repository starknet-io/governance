import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import AuthorizedUserView from "src/renderer/AuthorizedUserView";

export const DynamicCustomWidget = () => {
  const { user } = useDynamicContext();
  const isAuthorized = !!user;

  return isAuthorized ? (
    <AuthorizedUserView />
  ) : (
    <DynamicWidget
      innerButtonComponent="Connect"
      buttonContainerClassName="connect-button-container"
    />
  );
};
