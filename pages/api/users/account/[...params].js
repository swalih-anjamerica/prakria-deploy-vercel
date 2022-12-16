import { NextApiRequest, NextApiResponse } from "next";
import nc from 'next-connect'
import { ncOpts } from "../../../../api-lib/lib";
import PM from '../../../../controllers/project_manager/projectControllerPm'


/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const handler = nc(nc)

.get('/api/users/account/getPMusers',PM.fetchMyUsers)

export default handler