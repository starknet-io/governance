export const layout = "LayoutOnboarding";
import * as Sentry from "@sentry/react";
import { Button } from "@yukilabs/governance-components";

export function Page() {
  return (
    <>
      <Button
        onClick={() => {
          Sentry.addBreadcrumb({
            category: "test",

            message: "DEV TEST BREADCRUMB",
            level: "info",
            data: {
              test: "test",
              wallet: "0x2137",
            },
          });
          Sentry.captureException("DEV TEST EXCEPTION ");
        }}
      >
        TEST ERROR LOGGING
      </Button>
    </>
  );
}
