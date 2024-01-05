import { forwardRef, HTMLAttributes } from "react";

import { Handle } from "./Handle";
import { Button, Flex, Text } from "@chakra-ui/react";
import { TrashIcon } from "#src/Icons";

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
  onDeleteClick?: (id: number) => void;
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
      ghost,
      clone,
      wrapperRef,
      childCount,
      isNew,
      isLast,
      onDeleteClick,
      ...props
    },
    ref,
  ) => {
    let fontColor: string | undefined;
    let fontSize: string | undefined = "sm";
    const isFirstLevel = depth === 0;
    const paddingLeft = isFirstLevel ? 2 : indentationWidth * depth;
    const borderBottom =
      isFirstLevel && !clone && !isLast ? "1px solid #DCDBDD" : undefined;
    const borderRadius = clone ? "base" : "white";
    const hoverStyles =
      clone && isNew
        ? "#E2E2FF"
        : isNew && !clone && !ghost
        ? "#E2E2FF"
        : "white";

    if (depth == 1) {
      fontColor = "#4A4A4F";
      fontSize = "xs";
    } else if (depth == 2) {
      fontColor = "#86848D";
      fontSize = "xs";
    }

    return (
      <Flex
        opacity={ghost ? 0.3 : 1}
        alignItems="center"
        height="50px"
        boxShadow={borderRadius}
        borderRadius={borderRadius}
        borderBottom={borderBottom}
        backgroundColor={hoverStyles}
        pl={`${paddingLeft}`}
        pr="1"
        //@ts-expect-error error
        ref={wrapperRef}
        {...props}
      >
        <Flex
          flex="1"
          alignItems="center"
          justifyContent="space-between"
          ref={ref}
          style={style}
        >
          <Flex alignItems="center">
            <Handle {...handleProps} />
            <Text fontSize={fontSize} color={fontColor} fontWeight="medium">
              {value?.title ?? ""}
            </Text>
          </Flex>
          {!!childCount && (
            <Flex
              top="-10px"
              right="-10px"
              position="absolute"
              w="20px"
              height="20px"
              borderRadius="10px"
              boxShadow="base"
              alignItems="center"
              justifyContent="center"
              backgroundColor="white"
            >
              <Text color="black" fontSize="sm">
                {childCount}
              </Text>
            </Flex>
          )}
          {isFirstLevel && onDeleteClick != undefined && (
            <Button
              onClick={() => onDeleteClick?.(value.id)}
              p="0"
              m="0"
              variant="ghost"
            >
              <TrashIcon />
            </Button>
          )}
        </Flex>
      </Flex>
    );
  },
);
