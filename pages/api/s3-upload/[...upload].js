import nc from 'next-connect';

import aws, { S3 } from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { ncOpts } from '../../../api-lib/lib';
import { getAccountId } from '../../../api-lib/helpers/helperApiLib';
import { deleteFileFromDB } from '../../../controllers/Files/FileController';
import convertToType from '../../../helpers/typeConvert';

const handler = nc(ncOpts);

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new aws.S3();
var folderName;

function getFileStream(fileKey) {
	const downloadParams = {
		Key: fileKey,
		Bucket: process.env.AWS_BUCKET_NAME,
	};

	return s3.getObject(downloadParams).createReadStream();
}

var upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_BUCKET_NAME,
		key: function (req, file, cb) {
			const { brandid, folder, projectId = '', accountId } = req.query;

			let location;
			folderName = folder;
			location = brandid
				? `brand/${brandid}/${folder}`
				: projectId
					? `project/${projectId}/${folder}`
					: '';

			cb(null, `${accountId}/${location}/${file.originalname}`);
		},
	}),
});

const uploadMIddle = upload.array('file');

handler.use('/api/s3-upload/uploadFIle', uploadMIddle);

handler.post('/api/s3-upload/uploadFIle', (req, res) => {
	const files = req.files;
	let filename;
	let arr;
	const Allfiles = files.map((file) => {
		filename = file.key.split('/').pop();
		return {
			filename,
			folder: folderName,
			size: file.size,
			filekey: file.key,
		};
	});

	res.status(200).json(Allfiles);
});

handler.get('/api/s3-upload/view', (req, res) => {
	const { key } = req.query;
	const readStream = getFileStream(key);
	readStream.pipe(res);
});

handler.delete("/api/s3-upload/delete-file", async (req, res) => {

	try {
		const { key, place, isInFile } = req.query;
		if (!key) {
			return res.status(400).json({ error: "key must be passed in query." })
		}

		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key
		}

		s3.deleteObject(params, async function (err, data) {
			if (err) {
				return res.status(400).json({ error: "Not uploaded" })
			}


			if(convertToType(isInFile)){
				const { error, payload, status } = await deleteFileFromDB(key)
				return res.status(status).json(error||payload)
			}

			return res.status(200).json({})

		})

	} catch (error) {


		res.status(500).json({ error })
	}
})




export default handler;

export const config = {
	api: {
		bodyParser: false,
		responseLimit: false,
	},
};
