import React, { CSSProperties, forwardRef } from "react";
import { DragHoldIcon } from "./icon";

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
}

// eslint-disable-next-line react/display-name
export const Action = forwardRef<HTMLButtonElement, Props>(
  ({active, cursor, style, ...props}, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    );
  }
);

// eslint-disable-next-line react/display-name
export const Handle = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    return (
      <Action
        ref={ref}
        cursor="grab"
        data-cypress="draggable-handle"
        {...props}
      >
        <DragHoldIcon />
      </Action>
    );
  }
);
