import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import React, { useCallback, useRef } from "react";
import { Instance, sticky } from "tippy.js";
import { v4 as uuid } from "uuid";
import { Toolbar } from "@components/ui/Toolbar";
import { ImageWidth } from "./ImageWidth";
import getRenderContainer from "@lib/utils/getRenderContainer";
import { ImageAlt } from "./ImageAlt";
// import { MenuProps } from "@components/menus/types";
// import { Icon } from "@components/ui/Icon";
// import useContentItemActions from "@components/menus/ContentItemMenu/hooks/useContentItemActions";
// import { useData } from "@components/menus/ContentItemMenu/hooks/useData";





export const ImageMenu = ({
  editor,
  appendTo,
}) => {
  const menuRef = useRef(null);
  const tippyInstance = useRef(null);

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
  

  // const onAlignImageLeft = useCallback(() => {
  //   editor
  //     .chain()
  //     .focus(undefined, { scrollIntoView: false })
  //     .setImageBlockAlign("left")
  //     .run();
  // }, [editor]);

  // const onAlignImageCenter = useCallback(() => {
  //   editor
  //     .chain()
  //     .focus(undefined, { scrollIntoView: false })
  //     .setImageBlockAlign("center")
  //     .run();
  // }, [editor]);

  // const onAlignImageRight = useCallback(() => {
  //   editor
  //     .chain()
  //     .focus(undefined, { scrollIntoView: false })
  //     .setImageBlockAlign("right")
  //     .run();
  // }, [editor]);

  const onWidthChange = useCallback(
    (value) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor]
  );
  const onAltChange = useCallback(
    (value) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlt(value).run();
    },
    [editor]
  );



  const { isImageCenter, isImageLeft, isImageRight, width,altText } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        width: parseInt(ctx.editor.getAttributes("imageFigure")?.width || 0) || parseInt(ctx.editor.getAttributes("image")?.width || 0),
        altText:ctx.editor.getAttributes('imageFigure') ?.alt || '' || ctx.editor.getAttributes('image') ?.alt || ''
        // isImageLeft: ctx.editor.isActive("imageBlock", { align: "left" }),
        // isImageCenter: ctx.editor.isActive("imageBlock", { align: "center" }),
        // isImageRight: ctx.editor.isActive("imageBlock", { align: "right" }),
      };
    },
  });

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
        onCreate: (instance) => {
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
        {/* <Toolbar.Button
          tooltip="Align image left"
          active={isImageLeft}
          onClick={onAlignImageLeft}
        >
          <Icon name="AlignHorizontalDistributeStart" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Align image center"
          active={isImageCenter}
          onClick={onAlignImageCenter}
        >
          <Icon name="AlignHorizontalDistributeCenter" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Align image right"
          active={isImageRight}
          onClick={onAlignImageRight}
        >
          <Icon name="AlignHorizontalDistributeEnd" />
        </Toolbar.Button> */}
             {/* <button
                  onClick={actions.deleteNode}
                  type="button"
                  className="text-red p-1"
                >
                  <Icon name="Trash2" />
            </button> */}
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ImageMenu;
