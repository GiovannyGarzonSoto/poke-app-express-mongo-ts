import { model, Document, Schema } from 'mongoose'

export interface IAbility extends Document{
    name: string,
    description: string
}

const abilitySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la Habilidad es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripcion de la Habilidad es obligatoria']
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model<IAbility>('Ability', abilitySchema)