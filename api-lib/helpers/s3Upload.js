

import aws from 'aws-sdk'
import multer from 'multer';
import multerS3 from 'multer-s3'

export const s3Upload = (key) => {

    return new Promise((resolve, reject) => {

        aws.config.update({
            secretAccessKey: process.env.AWS_SECRET_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            region: process.env.AWS_REGION
        })


        const s3 = new aws.S3()


        var upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: process.env.AWS_BUCKET_NAME,
                key: function (req, file, cb) {
                    cb(null, `brand/foler/imthiyaz/${file.originalname}`)
                }
            })
        })
        const uploadMIddle = upload.array("file")
        uploadMIddle()

        resolve(true)

    })

}