import { EditorContent } from "@tiptap/react";
import React, {  forwardRef, useRef } from "react";
import { useBlockEditor } from "@hook/useBlockEditor";
import LinkMenu from "@components/menus/LinkMenu/LinkMenu";
import { TextMenu } from "@components/menus/TextMenu/TextMenu";
import ImageBlockMenu from "@extensions/Image/components/ImageMenu";
import { NewItemMenu } from "@components/menus/ContentItemMenu/NewItemMenu";
import { TableColumnMenu, TableRowMenu } from '@extensions/Table/menus'

// import '@/styles/index.css'
// import { Sidebar } from '@components/Sidebar/Sidebar'
// import ImageBlockMenu from '@extensions/ImageBlock/components/ImageBlockMenu'
// import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
// import { EditorHeader } from './components/EditorHeader'
// import { useSidebar } from '@hook/useSidebar'
// import * as Y from 'yjs'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
// import { ContentItemMenu } from '@components/menus/ContentItemMenu/ContentItemMenu'
// import { TableColumnMenu,TableRowMenu } from '@extensions/Table/menus'
// import { ColumnsMenu } from '@extensions/MultiColumn/menus'

export const BlockEditor = 
  forwardRef((
    {
      // aiToken,
      // provider,
      // files,
      // setFiles,
      // setDeletedPostFiles,
      // deletedPostFiles,
      // setDeletedFiles,
      // deletedFiles,
      // setEditorContent,
      ydoc,
      content,
      onChange,
      setValue,
       contentImages, setContentImage,thumnailIndex,setThumnailIndex
    },ref
    
  ) => {
    // const leftSidebar = useSidebar()
    const menuContainerRef = useRef(null);
    const {
      editor,
      // users,
      //  collabState
    } = useBlockEditor({
      // aiToken,
      // provider,
      // files,
      // setFiles,
      // deletedFiles,
      // setDeletedFiles,
      // setDeletedPostFiles,
      // deletedPostFiles,
      // setEditorContent,
      ydoc,
      content,
      onChange,
      setValue,
      contentImages, setContentImage,thumnailIndex,setThumnailIndex
    });
    if (
      !editor
      // || !users
    ) {
      return null;
    }

    return (
      <div className="" ref={menuContainerRef}>
        {/* <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} /> */}
        {/* <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          /> */}
        {/* <Toolbar editor={editor} content={content}/> */}
        {/* <ContentItemMenu editor={editor} /> */}
        {/* <ColumnsMenu editor={editor} appendTo={menuContainerRef} />*/}
        <div className="space-y-5">
          <EditorContent
            editor={editor}
            className="max-h-[500px] overflow-auto"
            ref={ref}
          />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} /> 
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} /> 
        </div>
        <NewItemMenu
          editor={editor}
          // files={files}
          // setFiles={setFiles}
          // setValue={setValue}
        />
        {/* <div className="sidebar">
        <div className="sidebar-options">
          <div className="label-large">Table of contents</div>
          <div className="table-of-contents">
            <MemorizedToC editor={editor} items={items} />
          </div>
        </div>
      </div> */}
      </div>
    );
  })

  BlockEditor.displayName = 'BlockEditor'; 
export default BlockEditor;
