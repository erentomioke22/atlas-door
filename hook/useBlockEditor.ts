import { useEffect, useState } from "react";
import { useEditor, Editor } from "@tiptap/react";
import { ExtensionKit } from "@/extensions/extension-kit";
import type { Doc as YDoc } from 'yjs'


type FileLikeWithUrl = { url: string };

type UseBlockEditorProps = {
  ydoc?: YDoc | null;
  initialContent: string;
  onChange: (html: string) => void;
  files: FileLikeWithUrl[];
  setFiles: (files: FileLikeWithUrl[]) => void;
  setValue: (name: string, value: unknown) => void;
  setDeletedFiles: (updater: (prev: string[]) => string[]) => void;
  setEditorContent: (editor: Editor) => void;
  setDeletedPostFiles: (updater: (prev: string[]) => string[]) => void;
  thumnailIndex: string | null;
  setThumnailIndex: (url: string | null) => void;
};

export const useBlockEditor = ({
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
  setThumnailIndex,
}: UseBlockEditorProps) => {
  const [tempRemovedFiles, setTempRemovedFiles] = useState<string[]>([]);
  const [prevNewFiles, setPrevNewFiles] = useState<string[]>([]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      extensions: [
        ...ExtensionKit({}),
      ].filter((e) => e !== undefined) as any,
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class:
            "min-h-full block px-2.5  mb-5  w-full focus:outline-none  ring-0 ",
          spellcheck: "false",
        },
        handleDrop: (_view, event, _slice, _moved) => {
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
        // setContentImage(newFiles);
        const remainingFiles = files.filter((file) =>
          newFiles.includes(file.url)
        );
        const removedFiles = files.filter(
          (file) => !newFiles.includes(file.url)
        );
        setTempRemovedFiles((prev) => [
          ...prev,
          ...removedFiles
            .map(f => f.url)
            .filter((removedUrl) => !prev.includes(removedUrl)),
        ]);
        const restoredFiles = tempRemovedFiles
          .filter((url) => newFiles.includes(url))
          .map(url => ({ url }));
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
        if (!newFiles.includes(thumnailIndex ?? "")) {
          setThumnailIndex(newFiles.length > 0 ? newFiles[0] : null);
        }
      },
    },
    [ydoc]
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
      setDeletedPostFiles((prevDeletedPostFiles) => [
        ...prevDeletedPostFiles,
        ...newFiles,
      ]);
    }
  }, [initialContent, editor]);

  return { editor };
};
