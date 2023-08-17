import React, { useState } from "react";
import {
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { Button } from "src/Button";
import { format } from "date-fns";
import FocusLock from "react-focus-lock";
import { Month_Names_Short, Weekday_Names_Short } from "./utils/calanderUtils";
import { CalendarPanel } from "./components/calendarPanel";
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
} from "./utils/commonTypes";
import { Timepicker } from "../../Timepicker";

export interface SingleDatepickerProps extends DatepickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  /**
   * disabledDates: `Uses startOfDay as comparison`
   */
  disabledDates?: Set<number>;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  id?: string;
  name?: string;
  usePortal?: boolean;
  showTimePicker?: boolean;
}

const DefaultConfigs: CalendarConfigs = {
  dateFormat: "yyyy-MM-dd",
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  configs,
  propsConfigs,
  usePortal,
  disabledDates,
  defaultIsOpen = false,
  closeOnSelect = true,
  showTimePicker = true,
  ...props
}) => {
  const {
    date: selectedDate,
    name,
    disabled,
    onDateChange,
    id,
    minDate,
    maxDate,
  } = props;

  const [dateInView, setDateInView] = useState(selectedDate);
  const [offset, setOffset] = useState(0);

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time);
    setIsTimePickerVisible(false);
  };

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const calendarConfigs: CalendarConfigs = {
    ...DefaultConfigs,
    ...configs,
  };

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDate);
    setOffset(0);
  };

  // dayzed utils
  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) return;
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
      if (closeOnSelect) onClose();
      return;
    }
  };

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;
  console.log(showTimePicker)
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
          id={id}
          autoComplete="off"
          isDisabled={disabled}
          name={name}
          value={
            selectedDate ? format(selectedDate, calendarConfigs.dateFormat) : ""
          }
          onChange={(e) => e.target.value}
          {...propsConfigs?.inputProps}
        />
      </PopoverTrigger>
      <PopoverContentWrapper>
        <PopoverContent
          width="100%"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody {...propsConfigs?.popoverCompProps?.popoverBodyProps}>
            {isTimePickerVisible ? (
              <Timepicker
                onSelectTime={handleTimeSelected}
                startDate={selectedDate}
              />
            ) : (
              <FocusLock>
                <CalendarPanel
                  dayzedHookProps={{
                    showOutsideDays: false,
                    onDateSelected: handleOnDateSelected,
                    selected: selectedDate,
                    date: dateInView,
                    minDate: minDate,
                    maxDate: maxDate,
                    offset: offset,
                    onOffsetChanged: setOffset,
                    firstDayOfWeek: calendarConfigs.firstDayOfWeek,
                  }}
                  isSingle={true}
                  configs={calendarConfigs}
                  propsConfigs={propsConfigs}
                  disabledDates={disabledDates}
                />
              </FocusLock>
            )}
          </PopoverBody>
          {showTimePicker && (
            <PopoverFooter>
              <Button
                onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}
                variant="solid"
                width="100%"
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
