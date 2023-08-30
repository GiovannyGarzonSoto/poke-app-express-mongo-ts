import multer from 'multer'
import path from 'path'

export default multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../../dist/uploads'),
        filename(req, file, callback) {
            callback(null, new Date().getTime()+path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname)
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            callback(null, false)
            return 
        }
        callback(null, true)
    },
})