import React, { useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { ProgressBar } from "../../components/common/ProgressBar";
import { useAddFile } from "../../hooks/queryHooks/useBrands";
import { uploadFile } from "../../services/fileUpload";

import API from "../../services/api";

function DragHere({ folder, brandid, projectid = "", setfilesCount, filesCount, children, role }) {
  const {
    mutate: addFiles,
    isIdle: addFileIdle,
    isError: addFileError,
    error: fileError,
  } = useAddFile();

  const [progress, setProgress] = useState();
  const cancelStyle = (e) => {
    e.target.style.border = "";
    e.preventDefault();
  };

  const onChangeHandler = async (files) => {
    try {
      if (!files.length) {
        return;
      }
      console.log(role);
      if ((folder == 'input' && role == 'designer' && !brandid) || (folder == 'downloads' && role != 'designer' && !brandid)) return toast.error("You can't upload here")

      toast.dismiss();
      toast.loading("uploading...");
      const formData = new FormData();

      let totalFIleSize = 0;
      // Allowing file type
      var allowedExtensions =
        /(\.csv|\.zip|\.cdr|\.svg|\.swg|\.mov|\.tga|\.mpeg|\.docx|\.xlxs|\.pptx|\.mp3|\.wma|\.rar|\.psd|\.ai|\.jpg|\.jpeg|\.png|\.mp4|\.pdf|\.gif)$/i; //regex for file type

      let invalidFileTypeFlag = 0;

      Array.from(files).forEach((file) => {
        totalFIleSize = totalFIleSize + file.size; // file size
        if (!allowedExtensions.exec(file.name)) {
          invalidFileTypeFlag++;
        }

        formData.append("file", file);
      });

      const fileInMB = Math.round(totalFIleSize / Math.pow(1024, 2)); // CONVERTING INTO MB
      // if (fileInMB > 20) return toast.error("File Size 20MB  Exceeded !");
      if (invalidFileTypeFlag) {
        toast.dismiss();
        return toast.error("Invalid File Type !");
      }



      const { status, data: file } = await uploadFile(
        formData,
        brandid,
        projectid,
        folder,
        setProgress
      );

      let data = {
        file,
        brandId: brandid,
        folder: folder,
        projectid
      };
      if (status) {
        if (brandid) {

          addFiles(data);
          if (addFileError) return console.log(addFileError);
          // if (addFileIdle) return toast.success("files Added");
          toast.dismiss()
          toast.success("Files Uploaded")
        }
        if (projectid) {

          const updateFile = await API.put(
            `/users/projects/all/addFiles?projectId=${projectid}&folder=${folder}`,
            { files: file }
          );
          if (updateFile.status === 201) {
            toast.dismiss()
            toast.success("Files Uploaded")
            return setfilesCount(filesCount + 1)

          }
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
    }
  };
  return (
    <>
      <ProgressBar progress={progress} />
      <Dropzone
        onDropRejected={() => toast.error("Invalid File Type !")}

        accept={
          ".csv,.psd,.zip,.ai,.cdr,.jpg,.png,.svg,.swg,.mp4,.mov,.tga,.avi,.mpeg,.docx,.xlxs,.pptx,.mp3,.wma,.zip,.rar,.pdf,.gif,.mp3,.jpeg"
        }
        onDrop={onChangeHandler}
        noClick={true}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              // className:
              //   "dropzone absolute top-[50%] left-[50%] w-[300px] h-[300px] xl:w-[400px] xl:h-[400px] border-2 border-dashed border-primary-gray my-5 rounded-full flex justify-center items-center py-10 ",
              // onDragOver: (e) => {
              //   e.target.style.border = "4px dashed purple";
              //   e.preventDefault();
              // },
              // onDragLeave: cancelStyle,
              // onDragEnd: cancelStyle,
              // onDrop: cancelStyle,
              // style: { transform: "translate(-50%, -50%)" }
            })}
          >
            {children}
            <input {...getInputProps()} />

          </div>
        )}
      </Dropzone>

    </>
  );
}

export default DragHere;
