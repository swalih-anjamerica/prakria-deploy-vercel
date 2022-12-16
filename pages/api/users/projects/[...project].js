import nc from 'next-connect'
import { ncOpts } from '../../../../api-lib/lib'
import { addProjectFile } from '../../../../controllers/user/projects/projectController'

const handler =nc(ncOpts)

handler.put('/api/users/projects/all/addFiles',addProjectFile)


export default handler