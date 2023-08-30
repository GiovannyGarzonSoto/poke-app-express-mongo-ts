import express, {Application} from 'express' 
import morgan from 'morgan'
import routes from './routes'
import path from 'path'
import env from 'dotenv'
import cors from 'cors'
import upload from './middlewares/multer'

const app: Application = express()
env.config()

app.use(cors())
app.use(morgan('dev'))
app.set('port', process.env.PORT)
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(upload.any())
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '../public')))

export default app