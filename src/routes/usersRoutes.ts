import {Router} from 'express'
import {authController} from '../controllers/authController'

const router: Router = Router()

router.post('/signup', authController.signup)

router.post('/signin', authController.signin)

router.put('/email-activate', authController.activateAccount)

router.put('/forgot-password', authController.forgotPassword)

router.put('/reset-password', authController.resetPassword)

export default router