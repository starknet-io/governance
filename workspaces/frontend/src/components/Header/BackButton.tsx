import { Box } from "@chakra-ui/react";
import { ArrowLeftIcon, Button } from "@yukilabs/governance-components";

interface BackButtonProps {
  urlStart: string[];
  href?: string;
  buttonText: string;
  pageContext?: { urlOriginal: string };
}

export const BackButton = ({
  urlStart,
  href,
  buttonText,
  pageContext,
}: BackButtonProps) => {
  const isMatch = urlStart.some(
    (start) => pageContext?.urlOriginal.startsWith(start),
  );
  if (!isMatch) {
    return null; // Exit early if no match is found.
  }

  if (pageContext?.urlOriginal.includes("/posts")) {
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
          pl={{ base: "0", lg: "standard.sm" }}
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
