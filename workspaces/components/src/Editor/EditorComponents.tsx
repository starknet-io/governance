// import React, { Ref, PropsWithChildren } from "react";
// import {
//   Box,
//   Text,
//   Icon as ChakraIcon,
//   Portal as ChakraPortal,
// } from "@chakra-ui/react";

// type OrNull<T> = T | null;

// export const Button = React.forwardRef<
//   HTMLSpanElement,
//   PropsWithChildren<{ active: boolean; reversed: boolean } & BaseProps>
// >(({ className, active, reversed, ...props }, ref) => (
//   <Text
//     {...props}
//     ref={ref}
//     className={className}
//     cursor="pointer"
//     color={reversed ? (active ? "white" : "#aaa") : active ? "black" : "#ccc"}
//   />
// ));
// Button.displayName = "Button";

// export const EditorValue = React.forwardRef<
//   HTMLDivElement,
//   PropsWithChildren<{ value: any } & BaseProps>
// >(({ className, value, ...props }, ref) => {
//   const textLines = value.document.nodes
//     .map((node: any) => node.text)
//     .toArray()
//     .join("\n");
//   return (
//     <Box ref={ref} {...props} className={className} m="30px -20px 0">
//       <Text
//         fontSize="14px"
//         p="5px 20px"
//         color="#404040"
//         borderTop="2px solid #eeeeee"
//         bg="#f8f8f8"
//       >
//         Slate's value as text
//       </Text>
//       <Text
//         color="#404040"
//         fontFamily="monospace"
//         whiteSpace="pre-wrap"
//         p="10px 20px"
//       >
//         {textLines}
//       </Text>
//     </Box>
//   );
// });
// EditorValue.displayName = "EditorValue";

// export const Icon = React.forwardRef<
//   HTMLSpanElement,
//   PropsWithChildren<BaseProps>
// >(({ className, ...props }, ref) => (
//   <ChakraIcon
//     {...props}
//     ref={ref}
//     className={className}
//     boxSize="18px"
//     verticalAlign="text-bottom"
//   />
// ));
// Icon.displayName = "Icon";

// export const Instruction = React.forwardRef<
//   HTMLDivElement,
//   PropsWithChildren<BaseProps>
// >(({ className, ...props }, ref) => (
//   <Box
//     {...props}
//     ref={ref}
//     className={className}
//     whiteSpace="pre-wrap"
//     m="0 -20px 10px"
//     p="10px 20px"
//     fontSize="14px"
//     height="33px"
//     bg="yellow"
//   />
// ));
// Instruction.displayName = "Instruction";

// export const Menu = React.forwardRef<
//   HTMLDivElement,
//   PropsWithChildren<BaseProps>
// >(({ className, ...props }, ref) => (
//   <Box
//     {...props}
//     data-test-id="menu"
//     ref={ref}
//     className={className}
//     display="inline-flex"
//     gap="15px"
//     height="33px"
//     bg="green"
//   />
// ));
// Menu.displayName = "Menu";

// export const Portal: React.FC = ({ children }) => {
//   return typeof document === "object" ? (
//     <ChakraPortal>{children}</ChakraPortal>
//   ) : null;
// };
// Portal.displayName = "Portal";

import { PropsWithChildren, forwardRef } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface BaseProps {
  className?: string;
}
interface ToolbarProps extends BaseProps {
  className?: string;
}

const toolbarStyles: BoxProps = {
  position: "absolute",
  bottom: "12px",
  left: "12px",
  right: "12px",
  height: "32px",
  display: "flex",
  alignItems: 'center',
  gap: "4px",
  zIndex: 1,
};

export const Toolbar = forwardRef<BoxProps, PropsWithChildren<ToolbarProps>>(
  (props, ref) => <Box {...toolbarStyles} ref={ref} {...props} />
);

Toolbar.displayName = "Toolbar";
