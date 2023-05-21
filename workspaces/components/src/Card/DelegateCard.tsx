import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Avatar,
} from '@chakra-ui/react';

import { Heading } from '../Heading';
import { Text } from '../Text';
import { Button } from 'src/Button';
import { Tag } from 'src/Tag';
type Props = {
  address: string;
  avatar: string;
  role: string;
  statementExcerpt: string;
  onClick: () => void;
  noOfVotes: string;
};

export const DelegateCard = (props: Props) => {
  const {
    address = 'cillianhunter.eth',
    avatar = 'https://avatars.githubusercontent.com/u/1024025?v=4',
    role = 'degen',
    statementExcerpt = 'I have a background in theoretical computer science and cryptography and I have been deeply interested in the work...',
    onClick = () => console.log('clicked'),
    noOfVotes = '7.5m votes', // assuming this is the default number of votes
  } = props;
  return (
    <Card as="a" href="/delegates/profile" variant="outline">
      <CardHeader>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="16px"
        >
          <Avatar src={avatar} size="md" />
          <Box flex="1">
            <Heading variant="h5">{address}</Heading>
            <Text fontSize="13px" color="#6B6B80">
              {noOfVotes}
            </Text>
          </Box>
        </Box>
      </CardHeader>
      <CardBody>
        <Text fontSize="13px" noOfLines={3} color="#6B6B80">
          {statementExcerpt}
        </Text>
      </CardBody>
      <CardFooter>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          zIndex="200000"
          position="relative"
        >
          <Tag variant="listCard">{role}</Tag>
          <Button variant="outline" onClick={onClick}>
            Delegate
          </Button>
        </Box>
      </CardFooter>
    </Card>
  );
};
