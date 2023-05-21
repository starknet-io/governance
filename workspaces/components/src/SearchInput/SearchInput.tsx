import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

type Props = {};

export const SearchInput = (props: Props) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon
          as={HiOutlineMagnifyingGlass}
          color="muted"
          boxSize="5"
        />
      </InputLeftElement>
      <Input
        minWidth={{ base: '100%', md: '232px' }}
        height="36px"
        fontSize="13px"
        placeholder="Search by address or .eth"
      />
    </InputGroup>
  );
};
