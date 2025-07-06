import { hash, compare } from 'bcrypt'

const hashPassword = async (password)=>{
    try{
        const saltRounds = 10
        const hashedPassword = await hash(password, saltRounds)
        return hashedPassword
    }catch(error){
        console.log(error)
    }
}

const comparePasswords = async (password, hashedPassword)=>{
    return compare(password, hashedPassword)
}

export {hashPassword, comparePasswords}