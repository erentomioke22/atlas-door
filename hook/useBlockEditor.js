import { useEffect, useState } from 'react'
import { useEditor } from '@tiptap/react'
import { ExtensionKit } from '@extensions/extension-kit'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
// import { userColors, userNames } from '../lib/constants'
// import { randomElement } from '@lib/utils/index'
import { getHierarchicalIndexes, TableOfContents } from '@tiptap-pro/extension-table-of-contents'

// import  { AnyExtension, Editor } from '@tiptap/core'
// import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import  { Doc as YDoc } from 'yjs'
// import  { EditorUser } from '../components/BlockEditor/types'
// import { initialContent } from '@lib/data/initialContent'
// import { Ai } from '@/extensions/Ai'
// import { AiImage, AiWriter } from '@/extensions'

// declare global {
//   interface Window {
//     editor: Editor | null
//   }
// }


export const useBlockEditor = ({
  // aiToken,
  ydoc,
  // provider,
  // userId,
  // userName = 'Maxi',
  content,onChange,files,setFiles,setValue,deletedFiles,setDeletedFiles,setEditorContent,setDeletedPostFiles,deletedPostFiles, setContentImage,thumnailIndex,setThumnailIndex
}) => {
  // const [collabState, setCollabState] = useState(
  //   provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  // )
  const [prevNewFiles, setPrevNewFiles] = useState([]);
  const [tempRemovedFiles, setTempRemovedFiles] = useState([]);

  // console.log(prevNewFiles)
  // console.log(tempRemovedFiles)
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      // immediatelyRender: false,
      // onCreate: ctx => {
      //   if (provider && !provider.isSynced) {
      //     provider.on('synced', () => {
      //       setTimeout(() => {
      //         if (ctx.editor.isEmpty) {
      //           ctx.editor.commands.setContent(initialContent)
      //         }
      //       }, 0)
      //     })
      //   } else if (ctx.editor.isEmpty) {
      //     ctx.editor.commands.setContent(initialContent)
      //     ctx.editor.commands.focus('start', { scrollIntoView: true })
      //   }
      // },
      extensions: [
        ...ExtensionKit({
          // provider,
        }),
        // provider
        //   ? Collaboration.configure({
        //       document: ydoc,
        //     })
        //   : undefined,
        // provider
        //   ? CollaborationCursor.configure({
        //       provider,
        //       user: {
        //         name: randomElement(userNames),
        //         color: randomElement(userColors),
        //       },
        //     })
        //   : undefined,
          // TableOfContents.configure({
          //   getIndex: getHierarchicalIndexes,
          //   onUpdate(content) {
          //     setItems(content);
          //     const tocs = content.map(({ dom, editor, node,isActive,isScrolledOver,pos, ...cleanedItem }) => cleanedItem);
          //     setValue('tocs',tocs);
          //   },
          // }),
        // aiToken
        //   ? AiWriter.configure({
        //       authorId: userId,
        //       authorName: userName,
        //     })
        //   : undefined,
        // aiToken
        //   ? AiImage.configure({
        //       authorId: userId,
        //       authorName: userName,
        //     })
        //   : undefined,
        // aiToken ? Ai.configure({ token }) : undefined,
      ].filter((e)=> e !== undefined),
      
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class:'min-h-full block px-2.5  mb-5  w-full focus:outline-none  ring-0 ',
          spellcheck: 'false',
        },
        handleDrop: (view, event, slice, moved) => { event.preventDefault(); return true; },
      },
    content:content,
    // editable: false,
    // onUpdate: ({ editor }) => {
    //   onChange(editor.getHTML())
    //   setEditorContent(editor)
    //   const html = editor.getHTML();
    //   const tempDiv = document.createElement('div');
    //   tempDiv.innerHTML = html;
    //   const imgTags = tempDiv.getElementsByTagName('img');
    //   const newFiles = Array.from(imgTags).map(img =>img.src);
    //   const removedFiles = files.filter((file) => !newFiles.includes(file.url));
    //   console.log(removedFiles)
    //   const remainingFiles = files.filter(file =>newFiles.includes(file.url)); 
    //   // const removedFiles = prevNewFiles.filter(prevNewFile =>!newFiles.includes(prevNewFile));
    //   setDeletedFiles((prev) => [...prev, ...removedFiles.filter(removedFiles =>!prev.includes(removedFiles))].filter(deletedFile=> !newFiles.includes(deletedFile)));
    //   setFiles(remainingFiles); 
    //   console.log(newFiles)
    //   console.log(remainingFiles)
    //   console.log('Deleted Files:', deletedFiles, removedFiles);
    // },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      setEditorContent(editor);

      const html = editor.getHTML();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const imgTags = tempDiv.getElementsByTagName('img');
      const newFiles = Array.from(imgTags).map((img) => img.src);
      setContentImage(newFiles)
      const remainingFiles = files.filter((file) => newFiles.includes(file.url));
      const removedFiles = files.filter((file) => !newFiles.includes(file.url));
      setTempRemovedFiles((prev) => [...prev, ...removedFiles.filter((removedFile) => !prev.includes(removedFile.url))]);
      const restoredFiles = tempRemovedFiles.filter((tempRemovedFile) => newFiles.includes(tempRemovedFile.url));  
      const updatedFiles = [...remainingFiles, ...restoredFiles].filter((file, index, self) => index === self.findIndex((f) => f.url === file.url) ); 
      setFiles(updatedFiles);
      const removedFilesUrls = prevNewFiles.filter(prevNewFile =>!newFiles.includes(prevNewFile));
      setDeletedFiles((prev) => [
        ...prev,
        ...removedFilesUrls.filter((removedFileUrl) => !prev.includes(removedFileUrl)),
      ].filter((deletedFile) => !newFiles.includes(deletedFile)));
      if (!newFiles.includes(thumnailIndex)) { 
       const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
        setThumnailIndex(newFiles.length > 0 ? newFiles[0].replace(baseUrl, '') : null); 
       }
      setValue('contentImages',newFiles)
      // const removedFiles = prevNewFiles.filter((prevNewFile) => !newFiles.includes(prevNewFile.url));
      // setFiles([...remainingFiles, ...restoredFiles]);
      // setPrevNewFiles(newFiles);

      // console.log(removedFiles)
      // console.log('New Files:', newFiles);
      // console.log('Deleted Files:', deletedFiles, removedFiles);
    },
    },
    
    [ydoc, 
      // provider
    ],
    // [provider],
  )



useEffect(() => {
  if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content)
    const html = editor.getHTML();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const imgTags = tempDiv.getElementsByTagName('img');
      const newFiles = Array.from(imgTags).map(img =>img.src);
      setPrevNewFiles(newFiles)
      setContentImage(newFiles)
      setDeletedPostFiles(prevDeletedPostFiles => [...prevDeletedPostFiles, ...newFiles]);
  }
}, [content,editor])



console.log(editor.getHTML())
console.log(editor.getJSON())


  // const users = useEditorState({
  //   editor,
  //   selector: (ctx) => {
  //     if (!ctx.editor?.storage.collaborationCursor?.users) {
  //       return []
  //     }

  //     return ctx.editor.storage.collaborationCursor.users.map((user) => {
  //       const names = user.name?.split(' ')
  //       const firstName = names?.[0]
  //       const lastName = names?.[names.length - 1]
  //       const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

  //       return { ...user, initials: initials.length ? initials : '?' }
  //     })
  //   },
  // })

  // useEffect(() => {
  //   provider?.on('status', (event) => {
  //     setCollabState(event.status)
  //   })
  // }, [provider])

  // window.editor = editor

  return { editor,
    //  users, collabState 
    }
}


 
