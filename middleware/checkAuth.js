import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET)

            //console.log(token);
            //console.log(decode);

            req.user = await User.findById(decode.id).select(
                "-password -confirm -token -__v"
            )

            //console.log("reqUser", req.user)
            return next();
        }
        catch (error) {
            return res.status(404).json({msg: 'There are a error'})
        }
    }

    if(!token) {
        const error = new Error("Token is not valid");
        return res.status(401).json({msg: error.message})
    }

    next();
}

export default checkAuth;