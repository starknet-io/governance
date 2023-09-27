import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { HiArrowUpRight } from "react-icons/hi2";

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
          <HiArrowUpRight size="24px" />
        </CardFooter>
      </Card>
    </LinkBox>
  );
};
