import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { joinOurTeamHtml, requestQuoteHtml } from "../../helpers/mailHtmlFiles";
import transport from "../../lib/nodemailerTransport";
import User from "../../models/users";
import resourceService from "../../server/services/resource.services";
import userService from "../../server/services/user.services";
import mailUtils from "../../server/utils/mail.utils";

export const listAllClients = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = req.user;
            if (user.role !== "super_admin") return res.status(401).send();
            const { data: response, status } = await userService.listAllUsers({ ...req.query });
            resolve({ payload: { users: response.user, total: response.total }, status });
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 });
            } else {
                reject({ error: e.message })
            }
        }
    })
}

export const getDetailsOfOneClient = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = req.query?.params[1] || "";
            const { data } = await userService.getOneClient({ userId });
            resolve({ payload: data, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

export const requestQuoteEmailController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let body = req.body;
            let html = requestQuoteHtml(body);
            await mailUtils.sendMail({
                to: "Info@prakriadirect.com",
                subject: "Request a quote",
                html
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}


export const joinOurTeamFormController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let body = req.body;
            let htmlFile = joinOurTeamHtml(body);
            await transport.sendMail({
                from: process.env.SEND_EMAIL_ID,
                to: "Info@prakriadirect.com",
                html: htmlFile,
                subject: "Join our team"
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

export const assingNewPMToClientController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { pm_id, account_id } = req.body;
            const { data: pm } = await userService.findUserByIdV2({ id: pm_id });
            const { data: payload, status } = await resourceService.assignPMToResoure({ account_id, resource: pm });
            resolve({ payload, status });
        } catch (e) {
            reject(e);
        }
    })
}

export const listProjectManagers = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, status } = await resourceService.listProjectManagers({ ...req.query });
            resolve({ payload: { users: data.pms, total: data.total }, status });
        } catch (e) {
            reject(e);
        }
    })
}