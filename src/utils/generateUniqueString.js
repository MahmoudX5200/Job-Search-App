


import { customAlphabet } from 'nanoid'

const generateUniqueString = (length) => {

    const nanoid = customAlphabet('123456789', length || 13)
    return nanoid()
}


export default generateUniqueString