import mongoose, {connect} from 'mongoose' 

mongoose.set('strictQuery', false)
export const connectDatabase = async() => {
    try{
        await connect(`mongodb://localhost:27017/poke-app`)
        console.log('Database is connected')
    }catch(err){
        console.log(err)
    }
}