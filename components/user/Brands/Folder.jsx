import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { useAddFile } from "../../../hooks/queryHooks/useBrands";
import { useAuth } from "../../../hooks/useAuth";
import { uploadFile } from "../../../services/fileUpload";
import { ProgressBar } from "../../common/ProgressBar";
import { FaFolder } from "react-icons/fa";

export const Folder = ({ folder: name, brandid }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [onOver, setOnOver] = useState(false);
  const { role, user } = useAuth();
  const {
    mutate: addFiles,
    isIdle: addFileIdle,
    isError: addFileError,
    error: fileError,
  } = useAddFile();

  const cancelStyle = (e) => {
    // e.target.style.border = "";
    // e.preventDefault();
    setOnOver(false)
  };

  const onChangeHandler = async (files) => {
    if (!files.length) {
      return;
    }

    const formData = new FormData();

    let totalFIleSize = 0;
    // Allowing file type
    var allowedExtensions =
      /(\.csv|\.zip|\.cdr|\.svg|\.swg|\.mov|\.tga|\.mpeg|\.docx|\.xlxs|\.pptx|\.mp3|\.wma|\.rar|\.psd|\.ai|\.jpg|\.jpeg|\.png|\.mp4)$/i; //regex for file type

    let invalidFileTypeFlag = 0;
    Array.from(files).forEach((file) => {
      totalFIleSize = totalFIleSize + file.size; // file size
      if (!allowedExtensions.exec(file.name)) {
        invalidFileTypeFlag++;
      }

      formData.append("file", file);
    });

    const fileInMB = Math.round(totalFIleSize / Math.pow(1024, 2)); // CONVERTING INTO MB
    toast.dismiss();
    // if (fileInMB > 20) return toast.error("File Size 20MB  Exceeded !");
    if (invalidFileTypeFlag) return toast.error("Invalid File Type !");

    const { status, data: file } = await uploadFile(
      formData,
      brandid,
      "",
      name,
      setProgress
    );

    let data = {
      file,
      brandId: brandid,
      folder: name,
    };

    if (status) {
      addFiles(data);
      if (addFileError) return;
      if (addFileIdle) return toast.success("File(s) uploaded");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dropzone
      onDropRejected={() => toast.error("Invalid File Types")}
      accept={
        ".csv,.psd,.zip,.ai,.cdr,.jpg,.png,.svg,.swg,.mp4,.mov,.tga,.avi,.mpeg,.docx,.xlxs,.pptx,.mp3,.wma,.zip,.rar"
      }
      onDrop={
        role != "designer"
          ? onChangeHandler
          : () => toast.error("You can't Upload ")
      }
      noClick={true}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={`flex px-3 py-3 drop-shadow-md rounded flex-col col-span-1 hover:cursor-pointer bg-[#F5F5F5] items-center ${onOver ? "border-2 border-dotted border-blue-400" : "m-0"}`}
          {...getRootProps({
            // className: 'dropzone',
            onDragOver: (e) => {
              // e.stopPropagation();
              // e.target.style.border = "2px dotted purple";
              // e.preventDefault();
              setOnOver(true)
            },
            onDragLeave: cancelStyle,
            onDragEnd: cancelStyle,
            onDrop: cancelStyle,
          })}
          onClick={() => router.push(`/brands/${brandid}/${name}`)}
        >
          <input {...getInputProps()} />

          <div className="text-[#646464] flex items-center">
            <FaFolder className="w-24 h-24 p-5" />
          </div>
          <div className="p-0 m-0">
            <Link href={`/brands/${brandid}/${name}`}>
              <div className="noBorder text-center mt-0  text-[#646464] font-semibold z-0">
                {name}
              </div>
            </Link>
            <ProgressBar progress={progress} />
          </div>
        </div>
      )}
    </Dropzone>
  );
};
