import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react";
import AuthorizedUserView from "src/renderer/AuthorizedUserView";

export const DynamicCustomWidget = () => {
  const { user } = useDynamicContext();
  const isAuthorized = !!user;

  return isAuthorized ? (
    <AuthorizedUserView />
  ) : (
    <DynamicWidget
      innerButtonComponent="Connect"
      buttonClassName="connect-button"
      buttonContainerClassName="connect-button-container"
    />
  );
};
