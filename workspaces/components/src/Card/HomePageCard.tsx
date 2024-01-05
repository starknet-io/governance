import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

import { Text } from "../Text";

type HomePageCardProps = {
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
};
export const HomePageCard = ({
  title,
  description,
  link,
  isExternal,
}: HomePageCardProps) => {
  return (
    <LinkBox>
      <Card variant="homePage" height="full">
        <LinkOverlay href={link} isExternal={isExternal}>
          <CardHeader>{title}</CardHeader>
        </LinkOverlay>
        <CardBody>{description}</CardBody>
        <CardFooter
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            variant="smallStrong"
            letterSpacing={"0.12px"}
            color="content.default.default"
          >
            Learn more
          </Text>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.58301 3.75L19.833 3.75C20.0319 3.75 20.2227 3.82902 20.3633 3.96967C20.504 4.11032 20.583 4.30109 20.583 4.5V15.75C20.583 16.1642 20.2472 16.5 19.833 16.5C19.4188 16.5 19.083 16.1642 19.083 15.75V6.31066L5.36334 20.0303C5.07044 20.3232 4.59557 20.3232 4.30268 20.0303C4.00978 19.7374 4.00978 19.2626 4.30268 18.9697L18.0223 5.25L8.58301 5.25C8.16879 5.25 7.83301 4.91421 7.83301 4.5C7.83301 4.08579 8.16879 3.75 8.58301 3.75Z"
              fill="currentColor"
            />
          </svg>
        </CardFooter>
      </Card>
    </LinkBox>
  );
};
