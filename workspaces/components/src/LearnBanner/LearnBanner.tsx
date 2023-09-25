import { Avatar, Box, Flex, Link } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { BookIcon } from "./BookIcon";
import { Text } from "src/Text";
import { Button } from "src/Button";
import { HiArrowRight } from "react-icons/hi2";
import avatar from './avatar.jpg'

const data = {
  title: "Governance for dummies",
  author: {
    name: "Cillian Hunter",
    username: "cillianhunter.eth",
    avatar,
    date: "12 Jan 2023",
  },
  overview:
    "If you've ever wondered how the wild west of the Internet - the land of decentralized protocols - manages to maintain some semblance of order, then you're in the right place. It's like stepping into a party where everyone has a say in the playlist, and the chaos that ensues is precisely what makes it a blast. Let's unravel this techno-mumbo-jumbo and understand how this crowd-managed circus, also known as decentralized governance, works.",
  link: "/learn/governance_for_dummies",
};

export const LearnBanner = () => {
  return (
    <Box
      display="flex"
      p="standard.xl"
      borderRadius="xl"
      bgColor="#E9E8EA"
      gap="standard.xl"
      justifyContent="space-between"
      flexDir={{
        base: "column",
        md: "row",
      }}
    >
      <Box display="grid" gap="standard.xl" maxW="320px">
        <Heading
          display="flex"
          alignItems="center"
          gap="12px"
          variant="h2"
          as="h3"
          color="content.support.default"
        >
          <BookIcon />
          Learn
        </Heading>
        <Heading variant="h2" size="3xl">
          {data.title}
        </Heading>
        <Flex
          fontSize="12px"
          lineHeight="20px"
          fontWeight={500}
          letterSpacing="0.12px"
          gap="standard.xs"
          color="content.accent.default"
          whiteSpace="nowrap"
          alignItems="center"
        >
          <Flex gap="standard.base" alignItems="center">
            <Avatar width="22px" height="22px" title={data.author.username} src={data.author.avatar}/>
            <Text>{data.author.username} </Text>
          </Flex>
          <Text>•</Text>
          <Text>{data.author.date}</Text>
        </Flex>
      </Box>
      <Box flexBasis="50%">
        <Heading
          variant="h3"
          color="content.accent.default"
          pb="standard.base"
          mb="standard.xs"
        >
          Overview
        </Heading>
        <Text
          noOfLines={{
            base: 6,
            md: 4,
          }}
        >
          {data.overview}
        </Text>
        <Button
          as={Link}
          href={data.link}
          variant="primary"
          display="flex"
          alignItems="center"
          gap="standard.xs"
          width="min-content"
          mt="standard.md"
        >
          Read more
          <HiArrowRight />
        </Button>
      </Box>
    </Box>
  );
};
