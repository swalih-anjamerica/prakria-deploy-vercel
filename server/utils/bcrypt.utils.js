import bcrypt from "bcrypt";

const comparePassword = async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
}

const createHashPassword = async (passwod, saltRound) => {
    const saltPassword = bcrypt.hashSync(passwod, saltRound);
    return saltPassword;
}

const bcryptUtils = {
    comparePassword,
    createHashPassword
}

export default bcryptUtils;