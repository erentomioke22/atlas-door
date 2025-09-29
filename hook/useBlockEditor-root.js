import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "@extensions/extension-kit";
// import { useDebounce } from "use-debounce";

export const useBlockEditor = ({
  // aiToken,
  // provider,
  // userId,
  // userName = 'Maxi',
  ydoc,
  initialContent,
  onChange,
  files,
  setFiles,
  setValue,
  setDeletedFiles,
  setEditorContent,
  setDeletedPostFiles,
  setContentImage,
  thumnailIndex,
  setThumnailIndex,
}) => {
  const [tempRemovedFiles, setTempRemovedFiles] = useState([]);
  const [prevNewFiles, setPrevNewFiles] = useState([]);


  const editor = useEditor(
    {
      immediatelyRender: false,
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
      ].filter((e) => e !== undefined),

      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class:
            "min-h-full block px-2.5  mb-5  w-full focus:outline-none  ring-0 ",
          spellcheck: "false",
        },
        handleDrop: (view, event, slice, moved) => {
          event.preventDefault();
          return true;
        },
      },
      content: initialContent,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
        setEditorContent(editor);
        const html = editor.getHTML();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        
        const firstParagraph = tempDiv.querySelector("p")?.innerText || "";
        setValue("desc", firstParagraph);
        

        const imgTags = tempDiv.getElementsByTagName("img");
        const newFiles = Array.from(imgTags).map((img) => img.src);
        setContentImage(newFiles);
        const remainingFiles = files.filter((file) =>
          newFiles.includes(file.url)
        );
        const removedFiles = files.filter(
          (file) => !newFiles.includes(file.url)
        );
        setTempRemovedFiles((prev) => [
          ...prev,
          ...removedFiles.filter(
            (removedFile) => !prev.includes(removedFile.url) 
          ),
        ]);
        const restoredFiles = tempRemovedFiles.filter((tempRemovedFile) =>
          newFiles.includes(tempRemovedFile.url)
        );
        const updatedFiles = [...remainingFiles, ...restoredFiles].filter(
          (file, index, self) =>
            index === self.findIndex((f) => f.url === file.url)
        );
        setFiles(updatedFiles);
        const removedFilesUrls = prevNewFiles.filter(
          (prevNewFile) => !newFiles.includes(prevNewFile)
        );
        setDeletedFiles((prev) =>
          [
            ...prev,
            ...removedFilesUrls.filter(
              (removedFileUrl) => !prev.includes(removedFileUrl)
            ),
          ].filter((deletedFile) => !newFiles.includes(deletedFile))
        );
        if (!newFiles.includes(thumnailIndex)) {
          setThumnailIndex(newFiles.length > 0 ? newFiles[0] : null);
        }
        // setValue('contentImages',newFiles)
        // const removedFiles = prevNewFiles.filter((prevNewFile) => !newFiles.includes(prevNewFile.url));
        // setFiles([...remainingFiles, ...restoredFiles]);
        // setPrevNewFiles(newFiles);

      },
    },

    [
      ydoc,
      // provider
    ]
    // [provider],
  );

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
      setEditorContent(editor);
      const html = editor.getHTML();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const imgTags = tempDiv.getElementsByTagName("img");
      const newFiles = Array.from(imgTags).map((img) => img.src);
      setPrevNewFiles(newFiles);
      setContentImage(newFiles);
      setDeletedPostFiles((prevDeletedPostFiles) => [
        ...prevDeletedPostFiles,
        ...newFiles,
      ]);
    }
  }, [initialContent, editor]);

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

  return { editor };
};
