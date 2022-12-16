import nc from 'next-connect'
import { isAuthorize } from '../../../../api-lib/middlewares/auth'
import { ncOpts } from '../../../../api-lib/lib'
import { createBrand, listBrand,updateBrands } from '../../../../controllers/user/Brands/brandsController'


const handler = nc(ncOpts)

handler.use(isAuthorize)

handler.post(createBrand);
handler.get(listBrand)
// handler.put(updateBrands)


export default handler