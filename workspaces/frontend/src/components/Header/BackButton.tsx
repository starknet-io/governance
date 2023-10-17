import { Box } from "@chakra-ui/react";
import { ArrowLeftIcon, Button } from "@yukilabs/governance-components";

interface BackButtonProps {
  urlStart: string;
  href: string;
  buttonText: string;
  pageContext?: { urlOriginal: string };
}

export const BackButton = ({
  urlStart,
  href,
  buttonText,
  pageContext,
}: BackButtonProps) => {
  if (
    pageContext?.urlOriginal.includes("/councils/") &&
    pageContext?.urlOriginal.startsWith(urlStart)
  ) {
    const goBack = () => {
      window.history.back();
    };
    return (
      <Box>
        <Button
          leftIcon={<ArrowLeftIcon boxSize="20px" />}
          size={"sm"}
          variant="ghost"
          onClick={goBack}
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
  if (pageContext?.urlOriginal.startsWith(urlStart)) {
    return (
      <Box>
        <Button
          leftIcon={<ArrowLeftIcon boxSize="20px" />}
          size={"sm"}
          as="a"
          href={href}
          variant="ghost"
          pl={{ base: "0", lg: "standard.sm" }}
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
  return null;
};
