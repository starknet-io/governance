import { Avatar, Box, Flex, Icon, Link, SimpleGrid } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { BookIcon } from "./BookIcon";
import { Text } from "src/Text";
import { Button } from "src/Button";

import avatar from "./avatar.jpeg";
import { ArrowRightIcon } from "src/Icons";
import { HomeContainer } from "../ContentContainer";
import { HomePageCard } from "../Card/HomePageCard";
import React from "react";

const data = {
  title: "Starknet Governance overview",
  author: {
    name: "stoobie",
    username: "stoobie",
    avatar,
    date: "Nov 15th 2023",
  },
  overview:
    "Starknet is a permissionless decentralized Layer 2 (L2) validity rollup, built to enable Ethereum to scale by using cryptographic protocols called STARKs, without compromising Ethereum’s core principles of decentralization, transparency, inclusivity, and security.",
  link: "/learn/starknet_governance_overview",
};

const homeLinks = [
  {
    title: "Starknet’s progressive governance",
    description:
      "A decentralized network that strives to evolve over time needs to have progressively evolving decentralized governance mechanisms to support protocol upgrades.",
    link: "/learn/starknet's_progressive_governance",
  },
  {
    title: "Wrap STRK to vSTRK to vote",
    description:
      "In order to vote or to designate a delegate to vote for you on Starknet, you need to wrap STRK as vSTRK using the Governance hub. You can unwrap anytime.",
    link: "/learn/how_to_wrap_strk_and_unwrap_vstrk",
  },
  {
    title: "How to delegate voting power",
    description:
      "If you are a STRK token holder, you can select a delegate to vote in your place for protocol changes.",
    link: "/learn/how_to_delegate_voting_power",
  },
];

export const LearnBanner = () => {
  return (
    <Box
      p={{
        base: "standard.md",
        md: "standard.xxl",
      }}
      borderRadius="xl"
      bgColor="#E9E8EA"
    >
      <Box
        display="flex"
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
          <Heading
            variant="h3"
            color="content.accent.default"
            pb="standard.base"
          >
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
      <Box
        w={"100%"}
        h={"1px"}
        background={"border.forms"}
        my={"standard.lg"}
      />
      <Box pos="relative">
        <HomeContainer position="relative" zIndex="2" px="0px">
          <SimpleGrid
            columns={3}
            // gap="standard.md" // gap causing overflow on tablet
            overflowX="scroll"
            gridTemplateColumns="repeat(3, minmax(264px, 1fr))"
            pb="0"
            sx={{
              "> *:not(:last-child)": {
                marginRight: "standard.md",
              },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              overflowStyle: "none",
              msOverflowStyle: "none",
            }}
          >
            {homeLinks.map((link) => (
              <HomePageCard
                key={link.title}
                title={link.title}
                description={link.description}
                link={link.link}
              />
            ))}
          </SimpleGrid>
        </HomeContainer>
      </Box>
    </Box>
  );
};
