import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import React, { useCallback, useRef } from "react";
import { Instance, sticky } from "tippy.js";
import { v4 as uuid } from "uuid";
import { Toolbar } from "@/components/ui/Toolbar";
import { ImageWidth } from "./ImageWidth";
import getRenderContainer from "@/lib/utils/getRenderContainer";
import { ImageAlt } from "./ImageAlt";
import { Editor } from '@tiptap/react'
interface ImageMenuProps {
  editor: Editor;
  appendTo?: React.RefObject<any>;
}

export const ImageMenu = ({
  editor,
  appendTo,
}: ImageMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-image");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('image') || editor.isActive('imageFigure');
    return isActive;
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor]
  );
  
  const onAltChange = useCallback(
    (value: string) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlt(value).run();
    },
    [editor]
  );

  const { width, altText } = useEditorState({
    editor,
    selector: (ctx: any) => {
      return {
        width:
          parseInt(ctx.editor.getAttributes("imageFigure")?.width || 0) ||
          parseInt(ctx.editor.getAttributes("image")?.width || 0),
        altText:
          ctx.editor.getAttributes("image")?.alt ||
          ctx.editor.getAttributes("imageFigure")?.alt ||
          '',
      }
    },
  })

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance;
        },
        appendTo: () => {
          return appendTo?.current;
        },
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <Toolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <ImageWidth onChange={onWidthChange} value={width} />
        <ImageAlt onChange={onAltChange} value={altText}/>
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ImageMenu;
