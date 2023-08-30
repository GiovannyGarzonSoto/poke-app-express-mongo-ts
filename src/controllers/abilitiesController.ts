import { Request, Response } from 'express'
import Ability, { IAbility } from '../models/Ability'

export const abilitiesController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const data = await Ability.find()
                .sort('name')
                .exec()
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Ha ocurrido un problema al listar las Habilidades'
                })
            }
            return res.status(200).json({
                success: true,
                data
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'No se han podido listar las Habilidades',
                err
            })
        }
    },
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const data: IAbility = await Ability.findById(id)
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: 'La Habilidad no existe'
                })
            }
            return res.json({
                success: true,
                data
            })
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'No se ha podido listar la Habilidad',
                err
            })
        }
    },
    add: async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body
            const newAbility: IAbility = new Ability({ name, description })
            await newAbility.save().catch(err => {
                return res.status(400).json({
                    success: true,
                    message: 'Problemas al agregar la Habilidad',
                    err
                })
            })
            return res.json({
                success: true,
                data: newAbility
            })
        }catch(err){
            return res.status(400).json({
                success: true,
                message: 'No se ha podido agregar la Habilidad',
                err
            })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const {body} = req 
            const updatedAbility: IAbility = await Ability.findByIdAndUpdate(id, body, {new: true})
            if(!updatedAbility){
                return res.status(400).json({
                    success: false,
                    message: 'La habilidad no existe'
                })
            }
            return res.json({
                success: true,
                data: updatedAbility
            })
        }catch(err) {
            return res.status(400).json({
                success: false,
                message: 'No se ha podido actualizar la Habilidad',
                err
            })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const removedAbility: IAbility = await Ability.findByIdAndRemove(id)
            if(!removedAbility){
                return res.status(400).json({
                    success: false,
                    message: 'La habilidad no existe'
                })
            }
            return res.json({
                success: true,
                message: 'Habilidad eliminada',
                data: removedAbility
            })
        }catch(err) {
            return res.status(400).json({
                success: false,
                message: 'No se ha podido eliminar la Habilidad',
                err
            })
        }
    }
}