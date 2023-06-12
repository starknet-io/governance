import {
  ButtonProps,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { scrollIntoView } from '../utils/scrollIntoView';
import React, { forwardRef } from 'react';

type props = {
  variant:
    | 'solid'
    | 'outline'
    | 'outlineLight'
    | 'outlineRounded'
    | 'ghost'
    | 'primaryHero'
    | 'secondaryHero'
    | 'switch'
    | 'filter'
    | 'filterActive'
    | 'category'
    | 'switcher'
    | 'icon';
  children: React.ReactNode;
  toId?: string;
  href?: string;
  isExternal?: boolean;
  target?: ButtonProps['formTarget'];
} & ButtonProps;

export const Button = forwardRef<HTMLButtonElement, props>(
  ({ children, toId, href, ...rest }, ref) => {
    const handleOnClick = () => {
      if (!toId) {
        return;
      }

      scrollIntoView(toId);
    };

    return (
      <ChakraButton
        as={href != null ? 'a' : undefined}
        onClick={handleOnClick}
        ref={ref}
        href={href}
        {...rest}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';
