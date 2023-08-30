import mongoose, {connect} from 'mongoose' 

mongoose.set('strictQuery', false)
export const connectDatabase = async() => {
    try{
        await connect(`mongodb+srv://${process.env.ATLAS_URI}/poke-app?retryWrites=true&w=majority`)
        console.log('Database is connected')
    }catch(err){
        console.log(err)
    }
}