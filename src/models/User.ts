import { model, Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import uniqueValidator from 'mongoose-unique-validator' 

export interface IUser extends Document{
    name: string
    email: string
    password: string
    google?: boolean
    role?: string
    active?: boolean
    resetLink: string
    escapePassword(): object
    encryptPassword(password: string): Promise<string>
    validatePassword(password: string): Promise<boolean>
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del Usuario es obligatorio'],
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email del Usuario es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña de Usuario es obligatoria'],
    },
    google: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'USER'
    },
    active: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    resetLink: {
        data: String,
        default: ''
    }
}, {
    timestamps: true,
    versionKey: false
})

userSchema.plugin(uniqueValidator, {message: '{PATH} ya se encuentra utilizado'})

userSchema.methods.toJSON = function escapePassword() {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

userSchema.methods.encryptPassword = async(password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(16)
    return bcrypt.hash(password, salt)
}

userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}

export default model<IUser>('User', userSchema)