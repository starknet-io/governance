import { BaseElement } from "slate";
import {
  RenderElementProps as SlateRenderElementProps,
  RenderLeafProps as SlateRenderLeafProps,
} from "slate-react";

interface CustomParagraphElement extends BaseElement {
  type:
    | "paragraph"
    | "block-quote"
    | "bulleted-list"
    | "heading-two"
    | "heading-three"
    | "list-item"
    | "numbered-list";
  align: "left" | "right" | "center" | "justify";
}

type MyElement = CustomParagraphElement | BaseElement;

type RenderElementProps = Omit<SlateRenderElementProps, "element"> & {
  element: MyElement;
};

type RenderLeafProps = Omit<SlateRenderLeafProps, "leaf"> & { leaf: any };

function isCustomElement(
  element: MyElement
): element is CustomParagraphElement {
  return "align" in element;
}

export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  let style = {};
  if (isCustomElement(element)) {
    style = { textAlign: element.align };
    switch (element.type) {
      case "block-quote":
        return (
          <blockquote style={style} {...attributes}>
            {children}
          </blockquote>
        );
      case "bulleted-list":
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        );
      case "heading-two":
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 style={style} {...attributes}>
            {children}
          </h3>
        );
      case "list-item":
        return (
          <li style={style} {...attributes}>
            {children}
          </li>
        );
      case "numbered-list":
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        );
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
    }
  } else {
    return <p {...attributes}>{children}</p>;
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

  return <span {...attributes}>{children}</span>;
};
