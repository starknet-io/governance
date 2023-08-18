import { RangeDatepicker, SingleDatepicker } from "./datepicker";
import { useEffect, useState } from "react";

type Props = {
  single?: boolean;
  range?: boolean;
  date?: Date | Date[] | null;
  onDateChange: (d: Date | Date[]) => void;
  showTimePicker?: boolean;
};

const propsConfig = {
  dateNavBtnProps: {
    borderWidth: "0",
    colorScheme: "slate",
    padding: "2px",
    yearBtnProps: {
      display: "none",
    },
    nextYearBtnProps: {
      display: "none",
    },
    prevYearBtnProps: {
      display: "none",
    },
  },
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      color: "#1A1523",
      borderRadius: "50%",
      fontWeight: "normal",
      width: "44px",
      height: "44px",
      _hover: {
        background: "#23192D1A",
      },
    },
    isInRangeBtnProps: {
      borderRadius: "0",
      background: "#23192D1A",
    },
    selectedBtnProps: {
      background: "#1A1523",
      color: "white",
      _hover: {
        background: "#1A1523",
      },
    },
    todayBtnProps: {
      border: "1px solid #23192D1A",
    },
  },
  inputProps: {
    size: "lg",
    fontSize: 14,
  },
  popoverCompProps: {
    popoverContentProps: {
      color: "#19191A",
      borderWidth: "0",
      gap: "10px",
      boxShadow:
        "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)",
    },
    popoverBodyProps: {
      borderWidth: "0!important",
      border: "none!important",
      "& > *": {
        border: "none!important",
      },
    },
  },
  weekdayLabelProps: {
    fontWeight: "semibold",
    color: "#4A4A4F",
    paddingBottom: "10px",
  },
  dateHeadingProps: {
    fontWeight: "bold",
    fontSize: "20px",
  },
};

export const ChakraDatePicker = ({
  single = true,
  range,
  date,
  onDateChange,
  showTimePicker,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [selectedDates, setSelectedDates] = useState<Date[] | [null, null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  const handleSingleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleRangeDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    onDateChange(dates);
  };

  const today = new Date(); // Get the current date
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return (
    <>
      {single && (
        <SingleDatepicker
          name="date-input"
          date={selectedDate as Date}
          onDateChange={handleSingleDateChange}
          propsConfigs={propsConfig}
          showTimePicker={showTimePicker}
          minDate={yesterday} // Disable selecting dates before today
        />
      )}
      {range && !single && (
        <RangeDatepicker
          selectedDates={selectedDates as Date[]}
          onDateChange={handleRangeDateChange}
          name="range-input"
          propsConfigs={propsConfig}
          showTimePicker={showTimePicker}
          minDate={yesterday} // Disable selecting dates before today
        />
      )}
    </>
  );
};
