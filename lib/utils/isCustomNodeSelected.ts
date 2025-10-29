import { Editor } from "@tiptap/react";

import {
  Figcaption,
  HorizontalRule,
  Link,
  CodeBlock,
  Image,
  ImageFigure,
  Iframe,
  // AiWriter,
  // AiImage,
  // ImageBlock,
  // ImageUpload,
} from "@/extensions";
// import { TableOfContentsNode } from "@/extensions/TableOfContentsNode";

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripColumn =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-column.selected");
  const gripRow =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-row.selected");

  if (gripColumn || gripRow) {
    return true;
  }

  return false;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    CodeBlock.name,
    Link.name,
    Image.name,
    Iframe.name,
    // Figcaption.name,
    // ImageBlock.name,
    // AiWriter.name,
    // AiImage.name,
    // ImageUpload.name,
    // TableOfContentsNode.name,
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};

export default isCustomNodeSelected;
