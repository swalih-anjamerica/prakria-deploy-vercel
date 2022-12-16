import { useRef } from 'react';
import toast from 'react-hot-toast';

export const FileUploadButton = ({
	onChange,
	label,
	acceptedFileTypes,
	allowMultipleFiles,
	uploadFileName,
	style,
	formStyle = {}
}) => {
	const fileInputRef = useRef(null);
	const formRef = useRef(null);

	const onClickHandler = () => {
		fileInputRef.current?.click();
	};

	const onChangeHandler = (event) => {
		if (!event.target.files?.length) {
			return;
		};

		const formData = new FormData();
		let totalFIleSize = 0
		// Allowing file type
		var allowedExtensions = /(\.csv|\.zip|\.cdr|\.svg|\.swg|\.mov|\.tga|\.mpeg|\.docx|\.xlxs|\.pptx|\.mp3|\.wma|\.rar|\.psd|\.ai|\.jpg|\.jpeg|\.png|\.mp4)$/i; //regex for file type

		let invalidFileTypeFlag = 0

		Array.from(event.target.files).forEach((file) => {
			totalFIleSize = totalFIleSize + file.size // file size
			if (!allowedExtensions.exec(file.name)) {
				invalidFileTypeFlag++;
			}

			formData.append(event.target.name, file);
		});

		const fileInMB = Math.round((totalFIleSize / Math.pow(1024, 2))) // CONVERTING INTO MB
		toast.dismiss()
		// if (fileInMB > 20) return toast.error("File Size 20MB  Exceeded !")
		if (invalidFileTypeFlag) return toast.error("Invalid File Type !")

		onChange(formData);

		formRef.current?.reset();
	};

	return (
		<form ref={formRef} className="flex items-center mr-10 " style={formStyle}>
			<button
				type="button"
				className="yellow-action-button"
				onClick={onClickHandler}
				style={style || { textTransform: "none", fontWeight: "500" }}
			>
				{label}
			</button>
			<input

				accept={acceptedFileTypes}
				multiple={allowMultipleFiles}
				name={uploadFileName}
				onChange={onChangeHandler}
				ref={fileInputRef}
				style={{ display: 'none' }}
				type="file"
			/>
		</form>
	);
};

FileUploadButton.defaultProps = {
	acceptedFileTypes: '',
	allowMultipleFiles: true,
};
