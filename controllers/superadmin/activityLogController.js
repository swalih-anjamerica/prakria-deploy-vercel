import revisionService from "../../server/services/revision.services";

export const getResourceTimeStampController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: resourceTimes } = await revisionService.getResourcesTimeStamp({ ...req.query });
            resolve({ payload: resourceTimes, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}