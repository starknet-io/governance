import React, { useState } from "react";
import { Props as DayzedHookProps } from "dayzed";
import { Month_Names_Short, Weekday_Names_Short } from "./utils/calanderUtils";
import {
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { Input } from "src/Input";
import { CalendarPanel } from "./components/calendarPanel";
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from "./utils/commonTypes";
import { format } from "date-fns";
import FocusLock from "react-focus-lock";
import { Timepicker } from "../../Timepicker";
import { Button } from "../../Button";
import { CalendarIcon } from "src/Icons";

interface RangeCalendarPanelProps {
  dayzedHookProps: DayzedHookProps;
  configs: CalendarConfigs;
  propsConfigs?: PropsConfigs;
  selected?: Date | Date[];
}

export const RangeCalendarPanel: React.FC<RangeCalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  selected,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Calendar level
  const onMouseLeave = () => {
    setHoveredDate(null);
  };

  // Date level
  const onMouseEnterHighlight = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return;
    }
    setHoveredDate(date);
  };

  const isInRange = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return false;
    }
    const firstSelected = selected[0];
    if (selected.length === 2) {
      const secondSelected = selected[1];
      return firstSelected < date && secondSelected > date;
    } else {
      return (
        hoveredDate &&
        ((firstSelected < date && hoveredDate >= date) ||
          (date < firstSelected && date >= hoveredDate))
      );
    }
  };

  return (
    <Flex onMouseLeave={onMouseLeave}>
      <CalendarPanel
        selectedDate={selected}
        dayzedHookProps={dayzedHookProps}
        configs={configs}
        propsConfigs={propsConfigs}
        isInRange={isInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
      />
    </Flex>
  );
};

export interface RangeDatepickerProps extends DatepickerProps {
  selectedDates: Date[];
  configs?: DatepickerConfigs;
  disabled?: boolean;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
  usePortal?: boolean;
  showTimePicker?: boolean;
  selectedTime: string | string[] | null;
  setSelectedTime: React.Dispatch<
    React.SetStateAction<string | string[] | null>
  >;
}

const DefaultConfigs: CalendarConfigs = {
  dateFormat: "MM/dd/yyyy",
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs,
  propsConfigs = {},
  id,
  name,
  usePortal,
  defaultIsOpen = false,
  closeOnSelect = false,
  showTimePicker = false,
  setSelectedTime,
  selectedTime,
  ...props
}) => {
  const { selectedDates, minDate, maxDate, onDateChange, disabled } = props;

  // chakra popover utils
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());
  const [offset, setOffset] = useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  // const [selectedTime, setSelectedTime] = useState<string | string[] | null>(
  //   null,
  // );

  const handleTimeSelected = (time: string | string[]) => {
    setSelectedTime(time);
    if (Array.isArray(time)) {
      const [startTime, endTime] = time;
      const [startDate, endDate] = selectedDates;

      // Merge date and time
      startDate.setHours(
        parseInt(startTime.split(":")[0]),
        parseInt(startTime.split(":")[1]),
      );
      endDate.setHours(
        parseInt(endTime.split(":")[0]),
        parseInt(endTime.split(":")[1]),
      );

      onDateChange([startDate, endDate]);
    }
    setIsTimePickerVisible(false);
    onClose();
  };

  const calendarConfigs: CalendarConfigs = {
    ...DefaultConfigs,
    ...configs,
  };

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDates[0] || new Date());
    setOffset(0);
  };

  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) {
      return;
    }
    const newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        const firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        onDateChange(newDates);

        if (closeOnSelect || !showTimePicker) onClose();
        return;
      }

      if (newDates.length === 2) {
        onDateChange([date]);
        return;
      }
    } else {
      newDates.push(date);
      onDateChange(newDates);
    }
  };
  const getFormattedDateWithTime = (date: Date, timeString: string) => {
    // Split the time into hours and minutes
    const [hourStr, rest] = timeString.split(":");
    const [minuteStr, ampm] = rest.split(" ");

    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Create a new date with the specified time
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);

    // Return the formatted string
    return format(newDate, "MMM d, yyyy, h:mm aa");
  };

  const startDateString = selectedDates[0]
    ? getFormattedDateWithTime(selectedDates[0], selectedTime[0])
    : "Start Date";

  const endDateString = selectedDates[1]
    ? getFormattedDateWithTime(selectedDates[1], selectedTime[1])
    : "End Date";

  const intVal = `${startDateString} – ${endDateString}`;

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  return (
    <Popover
      placement="bottom-start"
      variant="responsive"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onPopoverClose}
      isLazy
    >
      <PopoverTrigger>
        <Input
          onKeyPress={(e) => {
            if (e.key === " " && !isOpen) {
              e.preventDefault();
              onOpen();
            }
          }}
          size="standard"
          icon={<CalendarIcon />}
          id={id}
          autoComplete="off"
          isDisabled={disabled}
          name={name}
          value={intVal}
          onChange={(e) => e.target.value}
          {...propsConfigs.inputProps}
        />
      </PopoverTrigger>
      <PopoverContentWrapper>
        <PopoverContent
          width="100%"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody {...propsConfigs.popoverCompProps?.popoverBodyProps}>
            {isTimePickerVisible ? (
              <Timepicker
                onSelectTime={handleTimeSelected}
                startDate={selectedDates[0]}
                endDate={selectedDates[1]}
                onClose={onClose}
              />
            ) : (
              <FocusLock>
                <RangeCalendarPanel
                  dayzedHookProps={{
                    onDateSelected: handleOnDateSelected,
                    selected: selectedDates,
                    monthsToDisplay: 2,
                    date: dateInView,
                    minDate: minDate,
                    maxDate: maxDate,
                    offset: offset,
                    onOffsetChanged: setOffset,
                    firstDayOfWeek: calendarConfigs.firstDayOfWeek,
                  }}
                  configs={calendarConfigs}
                  propsConfigs={propsConfigs}
                  selected={selectedDates}
                />
              </FocusLock>
            )}
          </PopoverBody>
          {showTimePicker && !isTimePickerVisible && (
            <PopoverFooter>
              <Button
                onClick={() => {
                  if (
                    Array.isArray(selectedDates) &&
                    selectedDates.length === 2 &&
                    typeof selectedDates[0] === "object" &&
                    typeof selectedDates[1] === "object"
                  ) {
                    setIsTimePickerVisible(!isTimePickerVisible);
                    if (isTimePickerVisible) {
                      onClose();
                    }
                  }
                }}
                variant="solid"
                disabled={
                  !selectedDates ||
                  (Array.isArray(selectedDates) && selectedDates.length < 2)
                }
                float="right"
                style={{ background: "black", color: "white" }}
              >
                {isTimePickerVisible ? "Apply" : "Choose Time"}
              </Button>
            </PopoverFooter>
          )}
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};
