import nc from "next-connect";
import aws from 'aws-sdk'
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from "next";
import { ncOpts } from '../../../../api-lib/lib'


const handler = nc(ncOpts)


aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
})


const upload = multer({dest:'./public/assets'})



/**
 * @method GET
 * @description controller for list single brand details
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

 const uploadMIddle = upload.single("files")



handler.post(async(req,res)=>{
    
})

export default handler

// export const config = {
//     api: {
//         bodyParser: false,
//     }
// }