import nc from 'next-connect'
import { ncOpts } from '../../../../api-lib/lib'
import { getBrand } from '../../../../controllers/user/Brands/singleBrandController'

const handler =nc(ncOpts)

handler.get(getBrand)


export default handler