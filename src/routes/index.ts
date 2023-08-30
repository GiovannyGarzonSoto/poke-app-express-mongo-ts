import usersRoutes from './usersRoutes'
import abilitiesRoutes from './abilitiesRoutes'

import {Router} from 'express'

const router: Router = Router()

router.use('/auth', usersRoutes)
router.use('/abilities', abilitiesRoutes)

export default router