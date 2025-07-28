import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import { ExtensionKit } from "@extensions/extension-kit";
// import { useDebounce } from "use-debounce";

export const useBlockEditor = ({
  // aiToken,
  ydoc,
  // provider,
  // userId,
  // userName = 'Maxi',
  initialContent,
  onChange,
  files,
  setFiles,
  setValue,
  deletedFiles,
  setDeletedFiles,
  setEditorContent,
  setDeletedPostFiles,
  deletedPostFiles,
  contentImages,
  setContentImage,
  thumnailIndex,
  setThumnailIndex,
}) => {
  const [tempRemovedFiles, setTempRemovedFiles] = useState([]);
  const [prevNewFiles, setPrevNewFiles] = useState([]);
  // const [content, setContent] = useState(initialContent);
  // const [debouncedContent] = useDebounce(content, 2000);

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

  // Load from local storage on mount
  // useEffect(() => {
  //   const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (savedContent && !initialContent) {
  //     setContent(savedContent);
  //     editor?.commands.setContent(savedContent);
  //   }
  // }, [editor]);

  // // Save to server when content changes (debounced)
  // useEffect(() => {
  //   if (debouncedContent && debouncedContent !== initialContent) {
  //     saveToServer(debouncedContent);
  //   }
  // }, [debouncedContent]);

  return { editor };
};
