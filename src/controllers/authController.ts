import { Request, Response } from 'express'
import User, {IUser} from '../models/User'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

//ethereal.email
const nmuser = 'darian.mcglynn41@ethereal.email'
const nmpass = 'EE1E6aYJuyaSgrJwbg'

export const authController = {
    signup: async(req: Request, res: Response) => {
        try{
            const {name, email, password} = req.body
            const verifyUser = await User.findOne({email})
            if(verifyUser){
                return res.status(200).json({
                    success: false,
                    message: 'El correo ya existe para otro usuario'
                })
            }
            const newUser: IUser = new User({
                name, 
                email,
                password
            })
            newUser.password = await newUser.encryptPassword(newUser.password)
            const data = await newUser.save()
            const payload = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }
            const token = jwt.sign(payload, process.env.SEED, {expiresIn: 1200})

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: nmuser,
                    pass: nmpass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            const info = await transporter.sendMail({
                from: 'noreply@mipet.com',
                to: email,
                subject: 'Pkapp Account Activation Link',
                html: `
                <h2>Please click on given link to activate your mipet account</h2>
                <p>localhost:8080/auth/activate/${token}</p>`
            })
            if(!info){
                return res.json({
                    success: false,
                    message: 'Problemas al enviar correo de verificacion'
                })
            } 
            return res.json({
                success: true,
                message: 'Le hemos enviado un correo para verificar su cuenta'
            })
        }catch(err){
            return res.status(200).json({
                success: false,
                message: 'Problemas al registrar el Usuario',
                err
            })
        }
    },
    signin: async(req: Request, res: Response) => {
        try{
            const data = await User.findOne({email: req.body.email})
            if(!data){
                return res.status(200).json({
                    success: false,
                    message: 'Correo o contraseña erronea'
                })
            }
            const correctPassword: boolean = await data.validatePassword(req.body.password) 
            if(!correctPassword){
                return res.status(200).json({
                    success: false,
                    message: 'Correo o contraseña erronea'
                })
            }
            if(!data.active) {
                return res.status(200).json({
                    success: false,
                    message: 'Es necesario confirmar su correo'
                })
            }
            const payload = {
                _id: data._id,
                email: data.email,
                role: data.role
            }
            const token = jwt.sign(payload, process.env.SEED, {
                expiresIn: 60*60*2 
            })
            return res.json({
                success: true,
                token
            })
        }catch(err){
            return res.status(200).json({
                sucess: false,
                message: 'No se pudo autenticar el Usuario',
                err
            })
        }
    },
    activateAccount: async(req: Request, res: Response) => {
        try{
            const {token} = req.body 
            if(!token) {
                return res.status(200).json({
                    success: false,
                    message: 'Es necesario un token'
                })
            }
            const decoded: any = jwt.verify(token, process.env.SEED)
            if(!decoded){
                return res.status(200).json({
                    success: false,
                    message: 'Token erroneo o expirado'
                })
            }
            const {email} = decoded
            const user = await User.findOne({email})
            await user.updateOne({active: true})
            return res.json({
                success: true,
                message: 'La cuenta ha sido activada'
            })
        }catch(err){
            return res.status(200).json({
                success: false,
                message: 'Error al activar la cuenta',
                err
            })
        }
    },
    forgotPassword: async(req: Request, res: Response) => {
        try{
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user){
                return res.status(200).json({
                    success: false,
                    message: 'Problemas al realizar la operacion'
                })
            }
            const token = jwt.sign({_id: user._id}, process.env.SEED, {expiresIn: 1200})
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: nmuser,
                    pass: nmpass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            const info = await transporter.sendMail({
                from: 'noreply@mipet.com', // sender address,
                to: email,
                subject: 'Pkapp Reset Password Link',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>localhost:8080/auth/resetpass/${token}</p>`
            })
            console.log(info)
            if(!info){
                return res.json({
                    success: false,
                    message: 'Problemas al cambiar su contraseña'
                })
            }
            const data = await user.updateOne({resetLink: token})
            console.log(data)
            if(!data){
                return res.status(200).json({
                    success: false,
                    message: 'Enlace de resetear contraseña incorrecto'
                })
            }
            return res.json({
                success: true,
                message: 'Le hemos enviado un enlace para resetear la contraseña'
            })
        }catch(err){
            return res.status(200).json({
                success: false,
                message: 'Error al enviar enlace para resetear contraseña',
                err
            })
        }
    },
    resetPassword: async(req: Request, res: Response) => {
        try{
            const {resetLink, newPass} = req.body
            if(!resetLink){
                return res.status(200).json({
                    success: false,
                    message: 'Token incorrecto o expirado'
                })
            }
            const decoded = jwt.verify(resetLink, process.env.SEED)
            if(!decoded){
                return res.status(200).json({
                    success: false,
                    message: 'Error al verificar el token'
                })
            }
            let user = await User.findOne({resetLink})
            const obj = {
                password: newPass,
                resetLink: ''
            }
            user = _.extend(user, obj)
            user.password = await user.encryptPassword(user.password)
            const modifiedUser = await user.save()
            if(!modifiedUser){
                return res.status(200).json({
                    success: false,
                    message: 'Error al modificar contraseña',
                })
            }
            return res.json({
                success: true,
                message: 'Tu contraseña ha sido modificada'
            })
        }catch(err){
            return res.status(200).json({
                success: false,
                message: 'Error al resetear contraseña',
                err
            })
        }
    } 
}