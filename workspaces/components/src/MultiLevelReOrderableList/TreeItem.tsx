import { forwardRef, HTMLAttributes } from "react";

import { Handle } from "./Handle";
import { Button, Flex, Text } from "@chakra-ui/react";
import { TrashIcon } from "src/Icons";

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
      wrapperRef,
      isNew,
      clone,
      ghost,
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
      isFirstLevel && !isLast && !clone ? "1px solid #DCDBDD" : "unset";
    const backgroundColor = isNew ? "#E2E2FF" : "white";

    if (depth == 1) {
      fontColor = "#4A4A4F";
      fontSize = "xs";
    } else if (depth == 2) {
      fontColor = "#86848D";
      fontSize = "xs";
    }

    return (
      <Flex
        opacity={ghost ? 0.5 : 1}
        alignItems="center"
        height="50px"
        boxShadow={clone ? "base" : undefined}
        borderRadius={clone ? "base" : undefined}
        borderBottom={borderBottom}
        backgroundColor={backgroundColor}
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
          {isFirstLevel && !clone && onDeleteClick != undefined && (
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
