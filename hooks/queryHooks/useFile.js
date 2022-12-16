import { useMutation, useQuery, useQueryClient } from "react-query";
import API from "../../services/api";



export const uploadFile = async (data, setProgress = () => { }) => {

    const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (event) => {
            setProgress(Math.round((event.loaded * 320) / event.total));
        },
    };

    return await API.post(`/s3-upload/uploadFIle/?projectId=${data.projectId}&folder=${data.folder}&accountId=${data.accountId}`, data.formData, config)
}


export const useUploadFile = () => {

    return useMutation(uploadFile, {
        onSuccess: (data) => {

            console.log("here");
            console.log(data);
        },
        onError: (err) => console.log(err)
    })




}