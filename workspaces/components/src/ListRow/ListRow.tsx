import { Badge, Box, Icon } from '@chakra-ui/react';
import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { Text } from 'src/Text';

type Props = {
  title: string;
  status: 'last_call' | 'review';
  for: number;
  against: number;
  noOfComments: number;
  id: number;
  href?: string;
  type: 'snip' | 'vote';
};

export const ListRow = (props: Props) => {
  return (
    <Box
      as="a"
      href={props.href}
      display="flex"
      flexDirection="row"
      gap="16px"
      borderBottom="1px solid #ECEDEE"
      minHeight="68px"
      alignItems="center"
      _hover={{
        textDecoration: 'none',
        backgroundColor: '#F9FAFB',
      }}
    >
      <Box textTransform={'uppercase'}>
        <Text variant="breadcrumbs" color="#6B7280">
          {props.type} {props.id}
        </Text>
      </Box>
      <Box flex="1">
        <Text variant="cardBody" noOfLines={1}>
          {props.title}
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="32px"
        alignItems="center"
        textTransform={'uppercase'}
      >
        <Box>
          <Text variant="breadcrumbs" color="#6B7280">
            {props.for} For: {props.against} Against{' '}
          </Text>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          gap="4px"
          alignItems="center"
        >
          <Icon as={HiOutlineChatBubbleLeftEllipsis} />{' '}
          <Text variant="breadcrumbs" color="#6B7280">
            {props.noOfComments}
          </Text>
        </Box>
        <Box>
          <Badge variant="last_call">Last call</Badge>
        </Box>
      </Box>
    </Box>
  );
};
