import React, { useState } from "react";
import {
  Box,
  Popover,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Stack,
} from "@chakra-ui/react";
import { Text } from "../Text";
import { IconButton } from "../IconButton";
import { Button } from "../Button";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export const Timepicker: React.FC<{
  onSelectTime: (a: string[]) => void;
  startDate?: Date;
  endDate?: Date;
  onClose: any;
}> = ({ onSelectTime, startDate, endDate }) => {
  const [hour, setHour] = useState({ start: 0, end: 0 });
  const [minute, setMinute] = useState({ start: 0, end: 0 });
  const [period, setPeriod] = useState({ start: "AM", end: "AM" });
  const [activeSection, setActiveSection] = useState<"hour" | "minute">("hour");
  const [activeTime, setActiveTime] = useState<"start" | "end">("start");

  const increment = () => {
    if (activeSection === "hour") {
      setHour((prevHour) => ({
        ...prevHour,
        [activeTime]:
          prevHour[activeTime] === 11 ? 0 : prevHour[activeTime] + 1,
      }));
    } else {
      setMinute((prevMinute) => ({
        ...prevMinute,
        [activeTime]:
          prevMinute[activeTime] === 59 ? 0 : prevMinute[activeTime] + 1,
      }));
    }
  };

  const decrement = () => {
    if (activeSection === "hour") {
      setHour((prevHour) => ({
        ...prevHour,
        [activeTime]:
          prevHour[activeTime] === 0 ? 11 : prevHour[activeTime] - 1,
      }));
    } else {
      setMinute((prevMinute) => ({
        ...prevMinute,
        [activeTime]:
          prevMinute[activeTime] === 0 ? 59 : prevMinute[activeTime] - 1,
      }));
    }
  };

  const togglePeriod = (time: "start" | "end") => {
    setPeriod((prevPeriod) => ({
      ...prevPeriod,
      [time]: prevPeriod[time] === "AM" ? "PM" : "AM",
    }));
  };

  const handleSelectTime = () => {
    const startTime = `${hour.start}:${
      minute.start < 10 ? `0${minute.start}` : minute.start
    } ${period.start}`;
    const endTime = `${hour.end}:${
      minute.end < 10 ? `0${minute.end}` : minute.end
    } ${period.end}`;
    if (startDate && endDate) {
      onSelectTime([startTime, endTime]);
    } else {
      onSelectTime([startTime]);
    }
  };

  return (
    <Popover>
      <PopoverHeader>
        <Text fontWeight="bold" fontSize="16">
          Choose Time
        </Text>
      </PopoverHeader>
      <PopoverBody>
        {/* Start Time */}
        {startDate && (
          <Box marginY={5}>
            <Stack
              flexDirection="row"
              marginBottom={2}
              align="center"
              justify="space-between"
            >
              <Text fontSize={14} fontWeight={600}>
                Start Time
              </Text>
              <Text fontSize={12} fontWeight={500}>
                {startDate.toDateString()}
              </Text>
            </Stack>
            <Stack
              flexDirection="row"
              justify="space-between"
              align="center"
              spacing={4}
            >
              <IconButton
                aria-label="minus"
                icon={<AiOutlineMinus size="14px" />}
                variant="outline"
                onClick={() => {
                  setActiveTime("start");
                  decrement();
                }}
              />
              <Stack
                flexDirection="row"
                alignItems="center"
                justify="center"
                gap="0"
                width="132px"
              >
                <Text
                  color="#4A4A4F"
                  marginX="2px"
                  fontSize="14"
                  padding="0 4px"
                  fontWeight="600"
                  bg={
                    activeSection === "hour" && activeTime === "start"
                      ? "#E2E8F0"
                      : "transparent"
                  }
                  borderRadius="4px"
                  px="2"
                  onClick={() => {
                    setActiveSection("hour");
                    setActiveTime("start");
                  }}
                >
                  {hour.start < 10 ? `0${hour.start}` : hour.start}
                </Text>
                <Text color="#4A4A4F" fontSize="14" fontWeight="600">
                  :
                </Text>
                <Text
                  color="#4A4A4F"
                  fontSize="14"
                  marginX="2px"
                  padding="0 4px"
                  fontWeight="600"
                  bg={
                    activeSection === "minute" && activeTime === "start"
                      ? "#E2E8F0"
                      : "transparent"
                  }
                  borderRadius="4px"
                  px="2"
                  onClick={() => {
                    setActiveSection("minute");
                    setActiveTime("start");
                  }}
                >
                  {minute.start < 10 ? `0${minute.start}` : minute.start}
                </Text>
                <Button
                  onClick={() => togglePeriod("start")}
                  size="sm"
                  variant="outline"
                >
                  {period.start}
                </Button>
              </Stack>
              <IconButton
                aria-label="plus"
                icon={<AiOutlinePlus size="14px" />}
                variant="outline"
                onClick={() => {
                  setActiveTime("start");
                  increment();
                }}
              />
            </Stack>
          </Box>
        )}
        {/* End Time */}
        {endDate && (
          <Box marginY={5}>
            <Stack
              flexDirection="row"
              marginBottom={2}
              align="center"
              justify="space-between"
            >
              <Text fontSize={14} fontWeight={600}>
                End Time
              </Text>
              <Text fontSize={12} fontWeight={500}>
                {endDate.toDateString()}
              </Text>
            </Stack>
            <Stack
              flexDirection="row"
              justify="space-between"
              align="center"
              spacing={4}
            >
              <IconButton
                aria-label="minus"
                icon={<AiOutlineMinus size="14px" />}
                variant="outline"
                onClick={() => {
                  setActiveTime("end");
                  decrement();
                }}
              />
              <Stack
                flexDirection="row"
                alignItems="center"
                justify="center"
                gap="0"
                width="132px"
              >
                <Text
                  color="#4A4A4F"
                  fontSize="14"
                  marginX="2px"
                  padding="0 4px"
                  fontWeight="600"
                  bg={
                    activeSection === "hour" && activeTime === "end"
                      ? "#E2E8F0"
                      : "transparent"
                  }
                  borderRadius="4px"
                  px="2"
                  onClick={() => {
                    setActiveSection("hour");
                    setActiveTime("end");
                  }}
                >
                  {hour.end < 10 ? `0${hour.end}` : hour.end}
                </Text>
                <Text color="#4A4A4F" fontSize="14" fontWeight="600">
                  :
                </Text>
                <Text
                  color="#4A4A4F"
                  fontSize="14"
                  padding="0 4px"
                  marginX="2px"
                  fontWeight="600"
                  bg={
                    activeSection === "minute" && activeTime === "end"
                      ? "#E2E8F0"
                      : "transparent"
                  }
                  borderRadius="4px"
                  px="2"
                  onClick={() => {
                    setActiveSection("minute");
                    setActiveTime("end");
                  }}
                >
                  {minute.end < 10 ? `0${minute.end}` : minute.end}
                </Text>
                <Button
                  onClick={() => togglePeriod("end")}
                  size="sm"
                  variant="outline"
                >
                  {period.end}
                </Button>
              </Stack>
              <IconButton
                aria-label="plus"
                icon={<AiOutlinePlus size="14px" />}
                variant="outline"
                onClick={() => {
                  setActiveTime("end");
                  increment();
                }}
              />
            </Stack>
            <PopoverFooter marginTop={6}>
              <Button
                onClick={handleSelectTime}
                variant="solid"
                width="100%"
                style={{ background: "black", color: "white" }}
              >
                {"Apply"}
              </Button>
            </PopoverFooter>
          </Box>
        )}
      </PopoverBody>
    </Popover>
  );
};
