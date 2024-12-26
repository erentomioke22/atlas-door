import { Icon } from "@components/ui/Icon";
import { Toolbar } from "@components/ui/Toolbar";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands";
import { useTextmenuStates } from "./hooks/useTextmenuStates";
import { BubbleMenu } from "@tiptap/react";
import { memo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { TbPaletteOff } from "react-icons/tb";
const MemoButton = memo(Toolbar.Button);
import useContentItemActions from "../ContentItemMenu/hooks/useContentItemActions";
import { useData } from "../ContentItemMenu/hooks/useData";
import { LinkEditorPanel } from "@components/panels/LinkEditorPanel/LinkEditorPanel";
// import { FontFamilyPicker } from "./components/FontFamilyPicker";
// import { FontSizePicker } from "./components/FontSizePicker";
// import { useTextmenuContentTypes } from "./hooks/useTextmenuContentTypes";
// import { ContentTypePicker } from "./components/ContentTypePicker";
// import { Surface } from "@components/ui/Surface";
// import { ColorPicker } from "@/components/panels";
// import { AIDropdown } from "./components/AIDropdown";
// We memorize the button so each button is not rerendered
// on every editor state change
// const MemoColorPicker = memo(ColorPicker);
// const MemoFontFamilyPicker = memo(FontFamilyPicker);
// const MemoFontSizePicker = memo(FontSizePicker);
// const MemoContentTypePicker = memo(ContentTypePicker);

// export type TextMenuProps = {
//   editor: Editor;
// };

export const TextMenu = ({ editor }) => {
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);
  // const blockOptions = useTextmenuContentTypes(editor);

    const data = useData();
    const actions = useContentItemActions(
      editor,
      data.currentNode,
      data.currentNodePos
    );
  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: {
          placement: "top-start",
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
              },
            },
          ],
        },
        maxWidth: "calc(100vw - 16px)",
        duration: 100
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <div className="bg-black flex text-wrap overflow-x-auto rounded-lg  p-1 dark:bg-white space-x-1">
        {/* <AIDropdown
          onCompleteSentence={commands.onCompleteSentence}
          onEmojify={commands.onEmojify}
          onFixSpelling={commands.onFixSpelling}
          onMakeLonger={commands.onMakeLonger}
          onMakeShorter={commands.onMakeShorter}
          onSimplify={commands.onSimplify}
          onTldr={commands.onTldr}
          onTone={commands.onTone}
          onTranslate={commands.onTranslate}
        /> */}
        {/* <Toolbar.Divider /> */}
        {/* <MemoContentTypePicker options={blockOptions} /> */}
        {/* <MemoFontFamilyPicker
          onChange={commands.onSetFont}
          value={states.currentFont || ""}
        /> */}
        {/* <MemoFontSizePicker
          onChange={commands.onSetFontSize}
          value={states.currentSize || ""}
        /> */}
        <MemoButton
          tooltip="Heading1"
          tooltipShortcut={["Mod", "H","1"]}
          onClick={commands.onHeading1}
          active={states.isHeading1}
        >
          <Icon name="Heading1" />
        </MemoButton>
        <MemoButton
          tooltip="Heading2"
          tooltipShortcut={["Mod", "H","2"]}
          onClick={commands.onHeading2}
          active={states.isHeading2}
        >
          <Icon name="Heading2" />
        </MemoButton>
        <MemoButton
          tooltip="Heading3"
          tooltipShortcut={["Mod", "H","3"]}
          onClick={commands.onHeading3}
          active={states.isHeading3}
        >
          <Icon name="Heading3" />
        </MemoButton>
        <MemoButton
          tooltip="Bold"
          tooltipShortcut={["Mod", "B"]}
          onClick={commands.onBold}
          active={states.isBold}
        >
          <Icon name="Bold" />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={["Mod", "I"]}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={["Mod", "U"]}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          tooltipShortcut={["Mod", "Shift", "S"]}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" />
        </MemoButton>
        {/* <MemoButton
          tooltip="Quote"
          tooltipShortcut={["Mod", "Shift", "Q"]}
          onClick={commands.onBlockquote}
          active={states.isQuote}
        >
          <Icon name="Quote" />
        </MemoButton> */}
        {/* <MemoButton
          tooltip="Code"
          tooltipShortcut={["Mod", "E"]}
          onClick={commands.onCode}
          active={states.isCode}
        >
          <Icon name="Code" />
        </MemoButton>
        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon name="FileCode" />
        </MemoButton> */}
            <Popover.Root>
                <Popover.Trigger asChild>
                  <Toolbar.Button tooltip="Set Link">
                    <Icon name="Link" />
                  </Toolbar.Button>
                </Popover.Trigger>
                <Popover.Content>
                  <LinkEditorPanel onSetLink={commands.onLink} />
                </Popover.Content>
           </Popover.Root>
        {/* <Popover.Root>
          <Popover.Trigger asChild> */}
            <MemoButton
              onClick={commands.onChangeHighlight}
              active={states.currentHighlight}
              tooltip="Highlight text"
            >
              <Icon name="Highlighter" />
            </MemoButton>
          {/* </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={commands.onChangeHighlight}
                onClear={commands.onClearHighlight}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root> */}
        {/* <Popover.Root>
          <Popover.Trigger asChild> */}
            <MemoButton 
            // active={!!states.currentColor} 
            onClick={commands.onChangeColor}
            active={states.currentColor}
            tooltip="Text color">
              <Icon name="Palette" />
            </MemoButton>
            <MemoButton 
            // active={!!states.currentColor} 
            onClick={commands.onClearColor}
            tooltip="Unset Color">
              <TbPaletteOff/>
            </MemoButton>

             <MemoButton 
             tooltip="remove Format"
             onClick={actions.resetTextFormatting}>
               <Icon name="RemoveFormatting" />
             </MemoButton>
             
             <MemoButton 
             tooltip="clipboard"
             onClick={actions.copyNodeToClipboard}>
               <Icon name="Clipboard" />
             </MemoButton>

          {/* </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentColor}
                onChange={commands.onChangeColor}
                onClear={commands.onClearColor}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root> */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon name="EllipsisVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <Toolbar.Wrapper>
              <MemoButton
                tooltip="Subscript"
                tooltipShortcut={["Mod", "."]}
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <Icon name="Subscript" />
              </MemoButton>
              <MemoButton
                tooltip="Superscript"
                tooltipShortcut={["Mod", ","]}
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <Icon name="Superscript" />
              </MemoButton>
              <MemoButton
                tooltip="Align left"
                tooltipShortcut={["Shift", "Mod", "L"]}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                tooltip="Align center"
                tooltipShortcut={["Shift", "Mod", "E"]}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                tooltip="Align right"
                tooltipShortcut={["Shift", "Mod", "R"]}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon name="AlignRight" />
              </MemoButton>
              <MemoButton
                tooltip="Justify"
                tooltipShortcut={["Shift", "Mod", "J"]}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon name="AlignJustify" />
              </MemoButton>
            </Toolbar.Wrapper>
          </Popover.Content>
        </Popover.Root>
      </div>
    </BubbleMenu>
  );
};
