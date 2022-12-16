
import Brands from "../../../models/brands";
import Projects from "../../../models/projects";
import User from "../../../models/users";
import Account from "../../../models/accounts";
import { NextApiRequest, NextApiResponse } from "next";
import { getAccountId } from "../../../api-lib/helpers/helperApiLib";
import { validateJWTToken } from "../../../middlewares/userJWTAuth";
import { sendNotifnMail, triggerNotificationServer } from "../../../helpers/notificationHelper";
import { notificationEmailTemplate } from "../../../helpers/mailHtmlFiles";
import accountService from "../../../server/services/account.services";


/**
 * @method POST
 * @description controller for create brand
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export const createBrand = async (req, res) => {

    try {

        const { name, accountId } = req.body

        let account = accountId
        if (!accountId) {

            var { error, payload, status } = await getAccountId(req)
            var { userId, accountId: account_id } = payload
            account = account_id

        }

        if (error) {
            res.status(status).json({ error })
        }



        // const BransExist = await Brands.exists({ account_id })

        const createResposnse = await Brands.create({
            name, account_id: account
        })


        res.status(201).json(createResposnse)


    } catch (error) {
        res.status(500).json(error)
    }
}


/**
 * @method PUT
 * @description controller for update brand
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */



export const addFolder = async (req, res) => {

    try {

        const { brandId } = req.query

        let { folder } = req.body

        folder = folder.toUpperCase()
        const isFolder = await Brands.exists({ $and: [{ folder }, { _id: brandId }] })

        if (isFolder) return res.status(406).json({ error: "Folder already exists" })

        const addResponse = await Brands.updateOne({ _id: brandId }, { $addToSet: { folder } })
        return res.status(201).json({ addResponse })

    } catch (error) {
    }

}




/**
 * @method PUT
 * @description controller for update brand
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */



export const addFiles = async (req, res) => {

    try {

        const { brandId, folder } = req.query
        const user = await validateJWTToken(req, res);
        let { files } = req.body

        if (!brandId) return res.status(400).json({ "error": "No  BrandId" })
        if (!folder) return res.status(400).json({ "error": "No  folder" })

        const isFolder = await Brands.exists({ $and: [{ folder }, { _id: brandId }] })

        if (!isFolder) return res.status(406).json({ error: "No folder found" })

        files = files.map(file => ({ ...file, user_id: user._id }));

        const brand = await Brands.findOneAndUpdate({ _id: brandId }, { $addToSet: { files: { $each: files } } })

        let htmlBody;
        let message;
        let path;
        let subject;
        let authUrl;
        // pm notification
        if (user.role === "client_admin" || user.role === "client_member") {
            const { role } = user;
            const account = await Account.findOne({
                [role == "client_admin" ? "client_admin" : "client_members.userId"]: user._id
            })
            const pm = await User.findOne({ _id: account?.account_manager });

            message = `${user.first_name + " " + user.last_name} has added a new files to Brand Assets`;
            subject = "Alert..";
            path = `/brands/${brandId}/${files[0].folder}`;
            authUrl = process.env.WEB_PROTOCOL + req.headers.host + path;
            htmlBody = notificationEmailTemplate(message, authUrl);
            sendNotifnMail(pm?.email, subject, htmlBody);
            triggerNotificationServer(pm?._id, message, path);
            // })
        }

        return res.status(201).json({})
    } catch (error) {
    }
}




export const deleteFileFromBrandController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { brand_id, file_id } = req.body;
            await Brands.updateOne({ _id: brand_id },
                {
                    $pull: {
                        files: {
                            _id: file_id
                        }
                    }
                })
            res.status(200).json({});
        } catch (e) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
}



/**
 * @method GET
 * @description controller for list brand
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export const listBrand = async (req, res) => {

    try {
        const { error, payload, status } = await getAccountId(req)

        if (error) {
            res.status(status).json({ error })
        }

        const { name, project, projectMan, sort = 1 } = req.query
        let { userId, accountId } = payload

        if (project) {
            const { account_id } = await Projects.findOne({ _id: project })

            accountId = account_id

        }
        if (projectMan) {
            const { data: brandDetails } = await accountService.findBrandsFromAccount({ ...req.query });
            return res.status(200).json(brandDetails);
        }
        const accountQuery = projectMan ? {} : { account_id: accountId }

        let searchQuery = name ? { $and: [accountQuery, { name: { $regex: name, $options: "i" } }] } : accountQuery

        const brandDetails = await Brands.find(searchQuery).sort({ updatedAt: sort }).populate({ path: 'account_id', account_manager: projectMan })
        if (!brandDetails) return res.status(204).json({ "message": "no brands" })

        res.status(200).json(brandDetails)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



