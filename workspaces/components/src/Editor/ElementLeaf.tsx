import { BaseElement } from "slate";
import {
  RenderElementProps as SlateRenderElementProps,
  RenderLeafProps as SlateRenderLeafProps,
} from "slate-react";
import ImageBlock from "./ImageBlock";
import LinkBlock from "./LinkBlock";

/* For serializing to work correctly make sure to use the same types used by "remark-slate" package */
export type CustomParagraphTypes =
  | "paragraph"
  | "block_quote"
  | "heading_one"
  | "heading_two"
  | "list_item"
  | "ul_list"
  | "ol_list"
  | "strike_through"
  | "image"
  | "link";

interface CustomParagraphElement extends BaseElement {
  type: CustomParagraphTypes;
}

type MyElement = CustomParagraphElement | BaseElement;

type RenderElementProps = Omit<SlateRenderElementProps, "element"> & {
  element: MyElement;
};

type RenderLeafProps = Omit<SlateRenderLeafProps, "leaf"> & { leaf: any };

export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const style = {};
  //@ts-expect-error error
  switch (element.type as CustomParagraphTypes) {
    case "block_quote":
      return (
        <blockquote
          style={{
            color: "grey",
            ...style,
            borderLeft: "3px solid grey",
            paddingLeft: 8,
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "heading_one":
      return (
        <h1 style={{ fontSize: 34, ...style }} {...attributes}>
          {children}
        </h1>
      );
    case "heading_two":
      return (
        <h2 style={{ fontSize: 32, ...style }} {...attributes}>
          {children}
        </h2>
      );
    case "ul_list":
      return (
        <ul style={{ paddingLeft: 16, ...style }} {...attributes}>
          {children}
        </ul>
      );
    case "ol_list":
      return (
        <ol style={{ paddingLeft: 16, ...style }} {...attributes}>
          {children}
        </ol>
      );
    case "list_item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "image":
      return <ImageBlock {...props} />;
    case "link":
      return <LinkBlock {...props} />;
    default:
      return (
        <span style={style} {...attributes}>
          {children}
        </span>
      );
  }
};

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.line_through) {
    children = (
      <span style={{ textDecoration: "line-through" }}>{children}</span>
    );
  }

  return <span {...attributes}>{children}</span>;
};
