import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react";
import { Button } from "@yukilabs/governance-components";
import AuthorizedUserView from "src/renderer/AuthorizedUserView";

export const DynamicCustomWidget = () => {
  const { user } = useDynamicContext();
  const isAuthorized = !!user;

  return isAuthorized ? (
    <AuthorizedUserView />
  ) : (
    <DynamicWidget
      innerButtonComponent={
        <Button size="condensed" variant="primary">
          Connect
        </Button>
      }
      // innerButtonComponent="Connect"
      // buttonClassName="connect-button"
      buttonContainerClassName="connect-button-container"
    />
  );
};
