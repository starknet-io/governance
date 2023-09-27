import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "src/Icons";

type HomePageCardProps = {
  title: string;
  description: string;
  link: string;
};
export const HomePageCard = ({
  title,
  description,
  link,
}: HomePageCardProps) => {
  return (
    <LinkBox>
      <Card variant="homePage" height="full">
        <LinkOverlay href={link} isExternal>
          <CardHeader>{title}</CardHeader>
        </LinkOverlay>
        <CardBody>{description}</CardBody>
        <CardFooter
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <span>Learn more</span>
          <ExternalLinkIcon boxSize="24px" color="content.default.default" />
        </CardFooter>
      </Card>
    </LinkBox>
  );
};
