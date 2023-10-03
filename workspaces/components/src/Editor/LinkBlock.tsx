import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

const LinkBlock = ({ attributes, element, children }: any) => {
  const handleOnClick = () => {
    element.link && window.open(element.link, element.target);
  };

  return (
    <span style={{ display: 'inline-block', color: 'red' }}>{children}</span>
    // <div onClick={handleOnClick} style={{ display: "inline" }}>
    //   <a
    //     href={element.link}
    //     {...attributes}
    //     {...element.attr}
    //     target={element.target}
    //     style={{ color: "blue", textDecoration: "underline" }}
    //   >
    //     {children}
    //   </a>
    // </div>
  );

  return (
    <>
      {/* <Popover
        returnFocusOnClose={false}
        isOpen
        onClose={() => {}}
        placement="top"
        closeOnBlur={false}
      > */}
      {/* <PopoverTrigger> */}

      {/* </PopoverTrigger> */}
      {/* <PopoverContent
          height="36px"
          backgroundColor="surface.accent.default"
          display="inline-block"
        >
          <Box
            px="2"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
          >
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="content.support.default"
            >
              Type or paste URL
            </Text>
          </Box>
        </PopoverContent> */}
      {/* </Popover> */}
    </>
  );
};

export default LinkBlock;
