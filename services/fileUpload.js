import API from './api';

export const uploadFile = async (formData, brandid = '', projectId = '', folder, setProgress) => {
	try {

		const data = await API.get(`/dev/accountIdByWhich/?brandid=${brandid}&projectId=${projectId}`);
		const accountId = data.data.id;

		const config = {
			headers: {
				// ...formData.getHeaders(),
				'content-type': 'multipart/form-data',
			},
			onUploadProgress: (event) => {
				setProgress(Math.round((event.loaded * 320) / event.total));
			},
		};
		const url = brandid ? `/s3-upload/uploadFIle/?brandid=${brandid}&folder=${folder}&accountId=${accountId}` : projectId ? `/s3-upload/uploadFIle/?projectId=${projectId}&folder=${folder}&accountId=${accountId}` : ""

		if (!url) alert("error")
		//
		// console.log(...formData.getHeaders());
		const res = await API.post(
			url,
			formData,
			config
		);

		if (res.status === 200) {
			// toast.success("File Uploaded")
			return { status: true, data: res.data };
		}
	} catch (error) {

		console.log(error);

	}
};

//to delete from S3 bucket
export const deleteFileHandler = async (key, isInFile=false) => await API.delete(`s3-upload/delete-file?key=${key}&isInFile=${isInFile}`)