import React, { useRef, Dispatch, SetStateAction } from 'react'
import { EditorContent } from '@tiptap/react'
import { LinkMenu } from '@/components/menus'
import { useBlockEditor } from '@/hook/useBlockEditor'
import ImageBlockMenu from '@/extensions//Image/components/ImageMenu'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { FileItem } from '@/app/(admin panel)/admin/create-post/create-post'
// import { useSidebar } from '@/hooks/useSidebar'
// import { Sidebar } from '@/components/Sidebar'
// import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
// import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
// import { EditorHeader } from './components/EditorHeader'

interface BlockEditorProps {
  aiToken?: string;
  ydoc: Y.Doc | null;
  provider?: TiptapCollabProvider | null | undefined;
  initialContent: string;
  onChange: (html: string) => void;
  files: FileItem[];
  setFiles: Dispatch<SetStateAction<FileItem[]>>;
  setValue: (name: string, value: unknown) => void;
  setEditorContent: (editor: any) => void;
  setDeletedPostFiles: (updater: (prev: string[]) => string[]) => void;
  setDeletedFiles: (updater: (prev: string[]) => string[]) => void;
  thumnailIndex: string | null;
  setThumnailIndex: (url: string  | null) => void;
}

export const BlockEditor = ({
  // aiToken,
  // provider,
  ydoc,
  initialContent,
  onChange,
  files,
  setFiles,
  setValue,
  setEditorContent,
  setDeletedPostFiles,
  setDeletedFiles,
  thumnailIndex,
  setThumnailIndex
} : BlockEditorProps) => {
  const menuContainerRef = useRef(null)

  // const leftSidebar = useSidebar()
  const { 
    editor,
    // users,
    // collabState 
  } = useBlockEditor({ 
    // aiToken, 
    // provider,
    ydoc, 
    initialContent,
    onChange,
    files,
    setFiles,
    setValue,
    setDeletedFiles,
    setEditorContent,
    setDeletedPostFiles,
    thumnailIndex,
    setThumnailIndex
  })

  if (!editor 
    // || !users
  ) {
    return null
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
        {/* <ColumnsMenu editor={editor} appendTo={menuContainerRef} /> */}
        {/* <TableRowMenu editor={editor} appendTo={menuContainerRef} /> */}
        {/* <TableColumnMenu editor={editor} appendTo={menuContainerRef} /> */}
      <div className="space-y-5">
        <EditorContent
          editor={editor}
          className="max-h-[500px] overflow-auto"
          // ref={ref}
        />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />  
        </div>
        <ContentItemMenu 
          editor={editor} 
          files={files}
          setFiles={setFiles}
          setValue={setValue}
          />
    </div>
  )
}

export default BlockEditor
