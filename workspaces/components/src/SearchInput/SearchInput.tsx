import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';
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
      <Input placeholder="Search by address or .eth" />
    </InputGroup>
  );
};
