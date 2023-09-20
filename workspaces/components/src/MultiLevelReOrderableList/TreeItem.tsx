import { forwardRef, HTMLAttributes } from "react";

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
  isNew?: boolean;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  isLast?: boolean;
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
      isNew,
      isLast,
      ...props
    },
    ref,
  ) => {
    let fontColor: string | undefined;
    let fontSize: string | undefined = "sm";
    const isFirstLevel = depth === 0;
    const paddingLeft = isFirstLevel ? 2 : indentationWidth * depth;

    if (depth == 1) {
      fontColor = "#4A4A4F";
      fontSize = "xs";
    } else if (depth == 2) {
      fontColor = "#86848D";
      fontSize = "xs";
    }

    return (
      <Box
        borderBottom={isFirstLevel && !isLast ? "1px solid #DCDBDD" : "unset"}
        backgroundColor={isNew ? "#E2E2FF" : "white"}
        p="3"
        pl={`${paddingLeft}`}
        //@ts-expect-error error
        ref={wrapperRef}
        {...props}
      >
        <Flex alignItems="center" ref={ref} style={style}>
          <Handle {...handleProps} />
          <Text fontSize={fontSize} color={fontColor} fontWeight="medium">
            {value?.title ?? ""}
          </Text>
        </Flex>
      </Box>
    );
  },
);
