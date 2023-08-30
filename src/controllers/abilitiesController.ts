import { Request, Response } from 'express'
import Ability from '../models/Ability'

export const abilitiesController = {
    getAll: async(req: Request, res: Response) => {
        try{
            const data = await Ability.find()
                .sort('name')
                .exec()
            if(!data){
                return res.status(404).json({
                    success: false,
                    message: 'Ha ocurrido un problema al listar las Habilidades'
                })
            }
            res.status(200).json({
                success: true,
                data
            })
        } catch(err) {
            return res.status(400).json({
                success: false,
                message: 'No se han podido listar las Habilidades',
                err
            })
        }
    },
    getOne: () => {
        return 
    },
    add: () => {
        return 
    },
    update: () => {
        return 
    },
    delete: () => {
        return
    }
}