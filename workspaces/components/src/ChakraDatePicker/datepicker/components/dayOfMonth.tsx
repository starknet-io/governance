import { Button, ButtonProps } from "@chakra-ui/react";
import { DateObj, RenderProps } from "dayzed";
import React, { useMemo } from "react";
import { DatepickerProps, DayOfMonthBtnStyleProps } from "../utils/commonTypes";

interface DayOfMonthProps extends DatepickerProps {
  renderProps: RenderProps;
  isInRange?: boolean | null;
  disabledDates?: Set<number>;
  dateObj: DateObj;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isSingle?: boolean;
  selectedDate?: Date | Date[];
}

type HoverStyle =
  | (ButtonProps["_hover"] & { _disabled: ButtonProps["_disabled"] })
  | undefined;

const halfGap = 0.125; //default Chakra-gap-space-1 is 0.25rem

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  propsConfigs,
  isInRange,
  disabledDates,
  renderProps,
  onMouseEnter,
  isSingle,
  selectedDate,
}) => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  const {
    defaultBtnProps,
    isInRangeBtnProps,
    selectedBtnProps,
    todayBtnProps,
  } = propsConfigs?.dayOfMonthBtnProps || {};
  const disabled = !selectable || disabledDates?.has(date.getTime());
  const styleBtnProps: DayOfMonthBtnStyleProps = useMemo(
    () => ({
      defaultBtnProps: {
        size: "sm",
        variant: "ghost",
        // this intends to fill the visual gap from Grid to improve the UX
        // so the button active area is actually larger than what it's seen
        ...defaultBtnProps,
        _after: {
          content: "''",
          position: "absolute",
          top: `-${halfGap}rem`,
          left: `-${halfGap}rem`,
          bottom: `-${halfGap}rem`,
          right: `-${halfGap}rem`,
          borderWidth: `${halfGap}rem`,
          borderColor: "transparent",
          ...defaultBtnProps?._after,
        },
        _hover: {
          bg: "purple.400",
          ...defaultBtnProps?._hover,
          _disabled: {
            bg: "gray.100",
            // temperory hack to persist the typescript checking
            ...(defaultBtnProps?._hover as HoverStyle)?._disabled,
          },
        },
      },
      isInRangeBtnProps: {
        background: "purple.200",
        ...isInRangeBtnProps,
      },
      selectedBtnProps: {
        background: "purple.200",
        ...selectedBtnProps,
      },
      todayBtnProps: {
        borderColor: "blue.400",
        ...todayBtnProps,
      },
      startDateProps: {
        position: "relative",
      },
      circleStyle: {
        backgroundColor: "black",
        borderRadius: "50%",
        zIndex: 100,
        position: "absolute",
        color: "white",
        content: '""',
      },
      halfBackgroundStyles: {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: "50%", // This ensures the grey background only covers the right half
        backgroundColor: "#23192D1A",
        zIndex: 1,
      },
      halfBackgroundStylesEnd: {
        content: '""',
        position: "absolute",
        top: 0,
        right: "50%", // This ensures the grey background only covers the left half
        bottom: 0,
        left: 0,
        backgroundColor: "#23192D1A",
        zIndex: 1,
      },
    }),
    [defaultBtnProps, isInRangeBtnProps, selectedBtnProps, todayBtnProps],
  );
  const isEndDateOfRange =
    !isSingle &&
    selected &&
    selectedDate &&
    Array.isArray(selectedDate) &&
    selectedDate[1] &&
    date.getTime() === selectedDate[1].getTime();
  const isStartDateOfRange = !isSingle && !isEndDateOfRange && selected;
  const noBorder = { border: "none", borderWidth: "none" };

  return (
    <Button
      {...getDateProps({
        dateObj,
        disabled: disabled,
        onMouseEnter: onMouseEnter,
      })}
      isDisabled={disabled}
      {...styleBtnProps.defaultBtnProps}
      {...(isInRange && !disabled && styleBtnProps.isInRangeBtnProps)}
      {...(selected && !disabled && styleBtnProps.selectedBtnProps)}
      {...(today && styleBtnProps.todayBtnProps)}
      {...(today && selected && noBorder)}
      {...(isStartDateOfRange && styleBtnProps.startDateProps)}
    >
      {isStartDateOfRange && (
        <div style={styleBtnProps.halfBackgroundStyles as any}></div>
      )}
      {isEndDateOfRange && (
        <div style={styleBtnProps.halfBackgroundStylesEnd as any}></div>
      )}
      {isStartDateOfRange && <div style={styleBtnProps.circleStyle as any}></div>}
      <span style={{ zIndex: "5" }}>{date.getDate()}</span>
    </Button>
  );
};
