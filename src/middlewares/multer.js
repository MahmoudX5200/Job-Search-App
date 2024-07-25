import multer from "multer"
import generateUniqueString from "../utils/generateUniqueString.js";
import { allowedExtensions } from "../utils/allowedExtensions.js";


export const multerMiddleHost = ({
    extensions = allowedExtensions.document,
}) => {

    // diskStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFileName = generateUniqueString(6) + '_' + file.originalname
            cb(null, uniqueFileName)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}
