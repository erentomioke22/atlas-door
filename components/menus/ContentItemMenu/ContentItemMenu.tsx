import { Icon } from "@/components/ui/Icon";
import useContentItemActions from "./hooks/useContentItemActions";
import { useData } from "./hooks/useData";
import React, { useCallback, useRef, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import GROUPS from "@/extensions/SlashCommand/groups";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { imageFileValidation } from "@/lib/validation";
import { imageUrlValidation } from "@/lib/validation";
import Input from "@/components/ui/input";
import { Editor } from '@tiptap/react'
// import {FaImage,FiUpload } from "react-icons/fa6";
// import { useCreateArchiveMutation } from "@components/posts/mutations";
// import { useUploadMutation } from "@components/posts/mutations";



export type FileItem = { file?: File; url: string , blobUrl?:string };

export type ContentItemMenuProps = {
  editor: Editor;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setValue: (name: string, value: unknown) => void;
};

export const ContentItemMenu = ({ editor, setFiles, files, setValue }: ContentItemMenuProps) => {
  // const [menuOpen, setMenuOpen] = useState(false);
  // const [showVideoInput, setShowVideoInput] = useState(false);
  // const { handleUploadClick, ref } = useFileUpload()
  // const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({ uploader: uploadFile })
  // const [imageUrl, setImageUrl] = useState();
  // const [imageKey, setImageKey] = useState();
  // const ArchiveMutation = useCreateArchiveMutation();
  // const uploadMutation = useUploadMutation();
  const data = useData();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");
  const [selectedInputImage, setSelectedInputImage] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  );

  // const handleImageUpload = (file) => {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     uploadMutation.mutate(formData, {
  //       onSuccess: (data) => {
  //         // console.log('File uploaded:', data.imageUrl);
  //         toast.success('File uploaded');
  //         if (data.imageUrl) {
  //           editor.chain().focus().setFigure({ src: data.imageUrl,
  //             // caption:''
  //            }).run()
  //         } else {
  //           toast.error('image upload failed')
  //         }
  //       },
  //       onError: (error) => {
  //         // console.error('Upload failed:', error.message);
  //         toast.error('Failed to upload file. Please try again.');
  //       },
  //     });
  // };

  const addVideo = () => {
    if (videoUrl && editor) {
      // editor.chain().focus().setYoutubeVideo({ src: videoUrl });
      // editor.commands.setYoutubeVideo({
      //   src: videoUrl,
      // width: Math.max(320, parseInt(width, 10)) || 640,
      // height: Math.max(180, parseInt(height, 10)) || 480,
      // })
      editor.chain().focus().setIframe({ src: videoUrl || "" }).run();
      setVideoUrl("");
      // setShowVideoInput(false);
    }
  };

  const onUpload = useCallback(
    (file?:File) => {
      if (file) {
        // handleImageUpload(file)
        const url = URL.createObjectURL(file);
        setFileError("");
        editor
          .chain()
          .focus()
          .setFigure({
            src: url || "",
            // caption:''
          })
          .run();
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, { file, url }];
          return updatedFiles;
        });
        setSelectedImage(null);
      }
    },
    [
      // getPos, editor,
      // handleImageUpload,
      setFiles,
    ]
  );

  const onUploadUrl = useCallback((imageUrl:string) => {
      if (imageUrl) {
        setFileError("");
        const result = imageUrlValidation.safeParse({ image: imageUrl });
        if (result.success) {
          setFileError("");
          editor.chain().setFigure({ src: imageUrl }).focus().run();
          setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, { url:imageUrl}];
            return updatedFiles;
          });
          setSelectedImageUrl(null);
        }
        else {
          setFileError(result.error.issues[0]?.message || "Invalid URL");
        }
      }
    },
    [
      // getPos, editor
    ]
  );



  function handleImageChange(file?:File) {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const result = imageFileValidation.safeParse({ image: file });
      if (result.success) {
        setFileError("");
        setSelectedImage(imageUrl);
        setSelectedFile(file);
      }
      else {
        setFileError(result.error.issues[0]?.message || "Invalid URL");
      }
    }
  }

  return (
    <div className="sticky bottom-0 bg-white dark:bg-black w-full p-2">
    <div className="flex gap-2  my-3">
      <div>
        <button
          type="button"
          onClick={() => {
            actions.handleAdd;
            setOpen(!open);
          }}
          className="bg-black  dark:bg-white text-white dark:text-black p-2 rounded-full"
        >
          {open ? <Icon name="Plus" /> : <Icon name="Plus" />}
        </button>
      </div>
      <div
        className={`transition-transform duration-500  transform ${
          open ? "max-w-fit flex flex-wrap gap-2" : "max-w-0 opacity-0 hidden"
        }`}
      >
        <Dropdown
          title={<Icon name="Video" />}
          className={
            "-right-10 w-72 z-50  overflow-auto bg-white border border-lbtn px-3 dark:border-dbtn dark:bg-black "
          }
          btnStyle={
            "p-2 rounded-full border-2 border-black dark:border-white text-black dark:text-white"
          }
        >
          <div className="relative space-y-1">
            <label htmlFor="">Video url</label>
            <Input
              type="text"
              placeholder="Enter YouTube Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 "
            />
            <button
              type="button"
              onClick={addVideo}
              className="bg-black dark:bg-white rounded-lg mt-2 px-3 py-2 w-full  dark:text-black text-white"
            >
              Insert Video
            </button>
          </div>
        </Dropdown>

        <Dropdown
          title={<Icon name="Image" />}
          className={
            "-right-20 w-72 z-50  overflow-auto bg-white border border-lbtn px-3 dark:border-dbtn dark:bg-black "
          }
          btnStyle={
            "p-2 rounded-full border-2 border-black dark:border-white text-black dark:text-white"
          }
        >
          <input
            type="file"
            accept="image/*"
            // value={selectedImage ? selectedImage : ''}
            onChange={(e) => {
              handleImageChange(e.target.files?.[0]);
            }}
            ref={fileInputRef}
            className="hidden sr-only"
            aria-label="upload image file"
          />
          {selectedImage || selectedImageUrl ? (
            <div className="space-y-2">
              <Image
                src={selectedImage || selectedImageUrl || ""}
                alt="avatar preview"
                width={150}
                height={150}
                className="size-32 w-full flex-none rounded-2xl object-cover"
              />
              <button
                type="button"
                disabled={
                  !!fileError
                  // || uploadMutation.isPending
                }
                onClick={() => {
                  selectedImageUrl
                    ? onUploadUrl(selectedImageUrl)
                    : onUpload(selectedFile);
                  setOpen(!open);
                }}
                className="text-black border-2 rounded-lg px-3 py-1 w-full text-center text-sm dark:border-white etxt-black dark:text-white disabled:cursor-not-allowed"
              >
                {/* {uploadMutation.isPending? <LoadingIcon color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "Add Image"} */}
                Add Image
              </button>
              <button
                type="button"
                disabled={
                  !!fileError
                  // || uploadMutation.isPending
                }
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedImageUrl(null);
                }}
                className="text-black border-2 rounded-lg px-3 py-1 w-full text-center text-sm dark:border-white etxt-black dark:text-white disabled:cursor-not-allowed"
                >
                Change Image
              </button>
                {fileError && <p className="text-red">{fileError}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                className="group relative block w-full"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <div className="h-full bg-linear-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont">
                  <div className="bg-lcard dark:bg-dcard rounded-2xl text-sm p-3">
                    <FiUpload />
                  </div>
                  <p className="text-sm ">Drop your image or browse</p>
                  <p className="text-[10px]">upload file up to 2mb</p>
                </div>
              </button>
              <Input
                type="text"
                placeholder="Image Url"
                onChange={(e) => {
                  setSelectedInputImage(e.target.value);
                }}
                value={selectedInputImage || ""}
              />
              <button
                className="bg-black text-white w-full py-2 px-3 dark:bg-white dark:text-black rounded-lg"
                type="button"
                onClick={() => {
                  setSelectedImageUrl(selectedInputImage || null);
                  setSelectedInputImage("");
                }}
                aria-label="Add Image by Url"
                title="Add Image by Url"
              >
                Add Image by Url
              </button>
            </div>
          )}
        </Dropdown>






        {GROUPS.map((group, groupIn) =>
          group.commands.map((command, commandIndex) => (
            <div key={command.iconName}>
              <button
                type="button"
                className="p-2 rounded-full border-2 border-black dark:border-white text-black dark:text-white"
                key={`${command.label}`}
                onClick={() => {
                  command.action(editor);
                }}
                aria-label={`${command.label}`}
                title={`${command.label}`}
              >
                <Icon name={command.iconName} />
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="bg-black  dark:bg-white text-white dark:text-black p-2 rounded-full disabled:cursor-not-allowed disabled:brightness-75"
          aria-label="Undo"
          title="undo"
        >
          <Icon name="Undo" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="bg-black  dark:bg-white text-white dark:text-black p-2 rounded-full disabled:cursor-not-allowed disabled:brightness-75"
          aria-label="Redo"
          title="Redo"
        >
          <Icon name="Redo" />
        </button>
      </div>
    </div>
    </div>
  );
};