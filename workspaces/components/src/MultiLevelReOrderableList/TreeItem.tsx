import React, { forwardRef, HTMLAttributes } from "react";

import { Handle } from "./Handle";
import { Box, Flex, Text } from "@chakra-ui/react";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: Record<string, any>;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

// eslint-disable-next-line react/display-name
export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      depth,
      handleProps,
      indentationWidth,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    let fontColor: string | undefined;
    let fontSize: string | undefined = 'sm';
    if (depth == 1) {
      fontColor = "#4A4A4F";
      fontSize = 'xs';
    } else if (depth == 2) {
      fontColor = "#86848D";
      fontSize = 'xs';
    }

    return (
      <Box
        borderLeft={depth > 0 ? "1px solid #DCDBDD" : undefined}
        backgroundColor="white"
        p="3"
        ml={`${indentationWidth * depth}`}
        //@ts-expect-error error
        ref={wrapperRef}
        style={
          {
            "--spacing": `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <Flex alignItems="center" ref={ref} style={style}>
          <Handle {...handleProps} />
          <Text
            fontSize={fontSize}
            color={fontColor}
            fontWeight="medium"
          >
            {value?.title ?? ''}
          </Text>
        </Flex>
      </Box>
    );
  },
);
