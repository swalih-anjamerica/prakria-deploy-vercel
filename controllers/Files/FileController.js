import Project from '../../models/projects'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const deleteFileFromDB = (key) => {


    return new Promise(async (resolve, reject) => {
        try {

            const keySplits = key.split('/')

            const place = keySplits[1]
            const projectId = keySplits[2]
            const folder = keySplits[3]
            const filename = keySplits[4]
        
            if (place === 'project') {


                const findQuery = folder === 'input' ? { _id: projectId, "input.filename": filename } : folder === 'downloads' && { _id: projectId, "download.filename": filename }
                const pullQuery = folder === 'input' ? { input: { filename } } : folder === 'downloads' && { download: { filename } }

                const isFileExist = await Project.findOne(findQuery)

                if (!isFileExist) return resolve({ error: "No File Found", status: 400 })

                const pullFile = await Project.updateOne({ _id: projectId }, { $pull: pullQuery })

                if (pullFile.modifiedCount) {
                    return resolve({ status: 200, payload: "File Deleted" })
                }

            }

        } catch (error) {
            reject({ error: 500, error })
        }

    })




}