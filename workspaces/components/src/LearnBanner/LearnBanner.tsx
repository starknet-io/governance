import { Avatar, Box, Flex, Icon, Link } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { BookIcon } from "./BookIcon";
import { Text } from "src/Text";
import { Button } from "src/Button";

import avatar from "./avatar.jpeg";
import { ArrowRightIcon } from "src/Icons";

const data = {
  title: "What is Starknet governance?",
  author: {
    name: "stoobie",
    username: "stoobie",
    avatar,
    date: "Nov 19th 2023",
  },
  overview:
    "Starknet is on the road toward decentralization, and part of that journey includes deciding how we're going to make decisions, and, for that matter, who are we? The answers to these big questions, along with all the little questions that arise as we answer the big ones, comprise a collection of mechanisms that enable the Starknet community to plot Starknet's course and steer it in the right direction to best serve that community.",
  link: "/learn/what_is_starknet_governance",
};

export const LearnBanner = () => {
  return (
    <Box
      display="flex"
      p={{
        base: "standard.md",
        md: "standard.xxl",
      }}
      borderRadius="xl"
      bgColor="#E9E8EA"
      gap="standard.xl"
      justifyContent="space-between"
      flexDir={{
        base: "column",
        md: "row",
      }}
    >
      <Box
        display="grid"
        gap={{
          base: "standard.xs",
          md: "standard.xl",
        }}
        minW={{
          md: "320px",
        }}
      >
        <Heading
          display="flex"
          alignItems="center"
          gap="standard.sm"
          variant="h2"
          as="h3"
          color="content.support.default"
          fontSize={{
            base: "16px",
            md: "28px",
          }}
          lineHeight={{
            base: "24px",
            md: "36px",
          }}
        >
          <Icon
            as={BookIcon}
            width={{
              base: "26.667px",
              md: "30px",
            }}
            height={{
              base: "24px",
              md: "26px",
            }}
          />
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
            <Avatar
              width="22px"
              height="22px"
              title={data.author.username}
              src={data.author.avatar}
            />
            <Text>{data.author.username}</Text>
          </Flex>
          <Text>•</Text>
          <Text>{data.author.date}</Text>
        </Flex>
      </Box>
      <Box>
        <Heading variant="h3" color="content.accent.default" pb="standard.base">
          Overview
        </Heading>
        <Text
          noOfLines={{
            base: 6,
            md: 4,
          }}
          fontSize="15px"
          lineHeight="24px"
          mt="standard.xs"
          mb="standard.md"
        >
          {data.overview}
        </Text>
        <Button
          as="a"
          href={data.link}
          variant="primary"
          display="flex"
          alignItems="center"
          gap="standard.xs"
          width="min-content"
        >
          Read more
          <ArrowRightIcon />
        </Button>
      </Box>
    </Box>
  );
};
