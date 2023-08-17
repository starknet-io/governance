import {
  HStack,
  VStack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useDayzed, Props as DayzedHookProps } from "dayzed";
import { ArrowKeysReact } from "../utils/reactKeysArrow";
import React, { useCallback, useMemo } from "react";
import { CalendarConfigs, DatepickerProps } from "../utils/commonTypes";
import { DatepickerBackBtns, DatepickerForwardBtns } from "./dateNavBtns";
import { DayOfMonth } from "./dayOfMonth";

export interface CalendarPanelProps extends DatepickerProps {
  dayzedHookProps: Omit<DayzedHookProps, "children" | "render">;
  configs: CalendarConfigs;
  disabledDates?: Set<number>;
  onMouseEnterHighlight?: (date: Date) => void;
  isInRange?: (date: Date) => boolean | null;
  isSingle?: boolean
  selectedDate?: Date | Date[]
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  disabledDates,
  onMouseEnterHighlight,
  isInRange,
  isSingle,
  selectedDate,
}) => {
  const renderProps = useDayzed(dayzedHookProps);
  const { calendars, getBackProps, getForwardProps } = renderProps;

  const weekdayNames = useMemo(() => {
    const firstDayOfWeek = configs.firstDayOfWeek;
    const dayNames = configs.dayNames;
    if (firstDayOfWeek && firstDayOfWeek > 0) {
      return configs.dayNames
        .slice(firstDayOfWeek, dayNames.length)
        .concat(dayNames.slice(0, firstDayOfWeek));
    }
    return dayNames;
  }, [configs.firstDayOfWeek, configs.dayNames]);

  // looking for a useRef() approach to replace it
  const getKeyOffset = useCallback((num: number) => {
    const e = document.activeElement;
    let buttons = document.querySelectorAll("button");
    buttons.forEach((el, i) => {
      const newNodeKey = i + num;
      if (el === e) {
        if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
          buttons[newNodeKey].focus();
        } else {
          buttons[0].focus();
        }
      }
    });
  }, []);

  const arrowKeysReact = new ArrowKeysReact({
    left: () => {
      getKeyOffset(-1);
    },
    right: () => {
      getKeyOffset(1);
    },
    up: () => {
      getKeyOffset(-7);
    },
    down: () => {
      getKeyOffset(7);
    },
  });

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Stack
      className="datepicker-calendar"
      direction={["column", "column", "row"]}
      {...arrowKeysReact.getEvents()}
    >
      {calendars.map((calendar, calendarIdx) => {
        return (
          <VStack key={calendarIdx} height="100%" padding="0.5rem 0.75rem">
            <HStack
              justify="space-between"
              width="100%"
              align="center"
              marginBottom={4}
            >
              <Heading
                size="sm"
                paddingLeft="8px"
                minWidth={"5rem"}
                textAlign="center"
                {...propsConfigs?.dateHeadingProps}
              >
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <HStack>
                <DatepickerBackBtns
                  calendars={calendars}
                  getBackProps={getBackProps}
                  propsConfigs={propsConfigs}
                />
                <DatepickerForwardBtns
                  calendars={calendars}
                  getForwardProps={getForwardProps}
                  propsConfigs={propsConfigs}
                />
              </HStack>
            </HStack>
            <SimpleGrid columns={7} spacingY={1} textAlign="center">
              {weekdayNames.map((day, dayIdx) => (
                <Box
                  fontSize="sm"
                  fontWeight="semibold"
                  key={dayIdx}
                  {...propsConfigs?.weekdayLabelProps}
                >
                  {day}
                </Box>
              ))}
              {calendar.weeks.map((week, weekIdx) => {
                return week.map((dateObj, index) => {
                  const key = `${calendar.month}-${calendar.year}-${weekIdx}-${index}`;
                  if (!dateObj) return <Box key={key} />;
                  const { date } = dateObj;
                  return (
                    <DayOfMonth
                      isSingle={isSingle}
                      selectedDate={selectedDate}
                      key={key}
                      dateObj={dateObj}
                      propsConfigs={propsConfigs}
                      renderProps={renderProps}
                      isInRange={isInRange && isInRange(date)}
                      disabledDates={disabledDates}
                      onMouseEnter={() => {
                        if (onMouseEnterHighlight) onMouseEnterHighlight(date);
                      }}
                    />
                  );
                });
              })}
            </SimpleGrid>
          </VStack>
        );
      })}
    </Stack>
  );
};
