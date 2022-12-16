import { handle } from 'express/lib/application'
import nc from 'next-connect'

import { ncOpts } from '../../../../../api-lib/lib'
import { addFiles, addFolder, deleteFileFromBrandController } from '../../../../../controllers/user/Brands/brandsController'


const handler = nc(ncOpts)

// handler.use((req,res)=>{console.log(req)})
handler.put('/api/users/brands/update/addFolder',addFolder)
handler.put('/api/users/brands/update/addFiles',addFiles)
handler.put('/api/users/brands/update/addFiles',addFiles)
handler.put('/api/users/brands/update/deleteFile',deleteFileFromBrandController)


export default handler