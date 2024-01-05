import { Button, EmptyState, Flex } from "@yukilabs/governance-components";
import { DocumentProps } from "#src/renderer/types";

export function Page() {
  return (
    <Flex
      height="100%"
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      pb="50px"
    >
      <EmptyState
        type="pageNotFound"
        title="We can’t find the page you’re looking for"
        hasBorder={false}
        action={
          <Button href="/" variant="primary" size="standard">
            Go to home
          </Button>
        }
      />
    </Flex>
  );
}

export const documentProps = {
  title: "Page Not Found!",
} satisfies DocumentProps;
