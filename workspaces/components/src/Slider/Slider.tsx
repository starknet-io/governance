import { Box, Slider as ChakraSlider, SliderMark, SliderProps as ChakraSliderProps, SliderThumb, SliderTrack, SliderFilledTrack } from "@chakra-ui/react";
import { useState } from "react";
import { Text } from "../Text";

interface SliderProps extends ChakraSliderProps {
    marks?: number[];
}

const LowerAmountCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none" style={{zIndex: "2", position: "absolute"}}>
        <circle cx="6.66675" cy="6" r="5" fill="#FBFBFB" stroke="#1A1523" strokeWidth="2"/>
    </svg>
)

const GreaterAmountCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none" style={{zIndex: "2", position: "absolute"}}>
        <circle cx="6.33325" cy="6" r="6" fill="#FBFBFB"/>
        <circle cx="6.33325" cy="6" r="5" stroke="#23192D" strokeOpacity="0.1" strokeWidth="2"/>
    </svg>
)

const SliderThumbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="none" style={{zIndex: "4", position: "absolute"}}>
        <circle cx="10" cy="10" r="9" fill="#FBFBFB" stroke="#1A1523" strokeWidth="2"/>
    </svg>
)

export const Slider: React.FC<SliderProps> = ({
    value = 50,
    onChange,
    marks = [25, 50, 75],
    ...props
}) => {
    const labelStyles = {
        mt: '2',
        ml: '-2',
        fontSize: 'sm',
      }

      const [sliderValue, setSliderValue] = useState(value);
      const [interactionStarted, setInteractionStarted] = useState(false);

      const handleSliderChange = (val: number) => {
          setSliderValue(val);
          if (onChange) {
              onChange(val);
          }
      }
    return (
        <Box px="6px" pb="26px">
            <ChakraSlider
                {...props}
                onChange={(val) => handleSliderChange(val)}
                onChangeStart={() => setInteractionStarted(true)}
                onChangeEnd={() => setInteractionStarted(false)}
            >
                <SliderMark value={0} {...labelStyles}>
                    <Box marginTop="-14px" bg="#ffffff" position="absolute">
                        {sliderValue > 0 ? <LowerAmountCircleIcon/> : null}
                        <Text
                            variant="smallStrong"
                            color="content.support.default"
                            sx={{
                                position: "absolute",
                                top: "18px"
                            }}
                        >0</Text>
                    </Box>
                </SliderMark>
                {marks?.map((mark) => (
                    <SliderMark value={mark} {...labelStyles} key={`mark-${mark}`}>
                        <Box marginTop="-14px" bg="#ffffff" position="absolute">
                            {sliderValue > mark + 1 ? <LowerAmountCircleIcon/> : sliderValue < mark - 1 ?
                            <GreaterAmountCircleIcon /> : null}
                        </Box>
                    </SliderMark>
                ))}
                <SliderMark value={100} {...labelStyles}>
                    <Box marginTop="-14px" bg="#ffffff" position="absolute">
                        {sliderValue < 100 ? <GreaterAmountCircleIcon /> : null}
                        <Text
                            variant="smallStrong"
                            color="content.support.default"
                            sx={{
                                position: "absolute",
                                top: "18px",
                                right: "-12px"
                            }}
                        >MAX</Text>
                    </Box>
                </SliderMark>
                {interactionStarted ? <SliderMark
                    value={sliderValue}
                    textAlign='center'
                    bg='surface.accent.default'
                    color='#FBFBFB'
                    mt='14px'
                    ml='-5'
                    p="2px 8px"
                    borderRadius="standard.base"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight={500}
                    lineHeight="20px"
                    letterSpacing="0.12px"
                >
                    {sliderValue === 100 ? "MAX" : `${sliderValue}%`}
                </SliderMark> : null}
                <SliderTrack bg="rgba(35, 25, 45, 0.10)" height="4px" zIndex="1">
                    <SliderFilledTrack bg="surface.accent.default" zIndex="1" />
                </SliderTrack>
                <SliderThumb width="20px" height="20px" zIndex="3">
                    <Box width="20px" height="20px">
                        <SliderThumbIcon />
                    </Box>
                </SliderThumb>
            </ChakraSlider>
        </Box>
    );
};
