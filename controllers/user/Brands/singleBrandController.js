import res from "express/lib/response"
import Brands from "../../../models/brands"
import { NextApiRequest, NextApiResponse } from "next";




/**
 * @method GET
 * @description controller for list single brand details
 * @param {NextApiRequestCookies} req 
 * @param {NextApiResponse} res 
 */


export const getBrand = async (req, res) => {

    try {

        const brandId = req.query.brandId

        if (!brandId) return res.status(400).json({ error: "No brand Id" })

        const brandResponse = await Brands.findOne({ _id: brandId })

        if(!brandResponse) return res.status(204)

        res.status(200).json(brandResponse)

    } catch (error) {
    }



}