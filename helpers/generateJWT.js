import jwt from "jsonwebtoken";

const generateJWT = (id) => {
    return jwt.sign( { id }, process.env.JWT_SECRET, { //generar un json webtoken
        expiresIn: "30d",
    } )
}

export default generateJWT;