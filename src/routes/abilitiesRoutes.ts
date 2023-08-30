import {Router} from 'express'
import {abilitiesController} from '../controllers'

const router: Router = Router()

router.get('/', abilitiesController.getAll)

router.get('/:id', abilitiesController.getOne)

router.post('/', abilitiesController.add)

router.put('/update/:id', abilitiesController.update)

router.put('/delete/:id', abilitiesController.delete)

export default router