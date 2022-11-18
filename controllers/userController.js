import User from '../models/User.js'
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import {emailOlvidePassword, emailRegistro} from '../helpers/email.js'
import { uploadFile, getFileURL } from '../s3.js';

const register = async (req, res) => {
    // buscar si hay usuario con ese email
    const {email} = req.body;
    const userExist = await User.findOne({ email });

    if(userExist) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message})
    }
    
    try {
        const user = new User(req.body);
        user.token = generateId();
        await user.save();

        res.json({msg: "User created correctly, check your email to confirm your account"})
    } catch (error) {
        console.log(error)
    }
}

const authenticate = async (req, res) => {
    //console.log('hola logear')
    const { email, password} = req.body; 

    

    const userExist = await User.findOne({ email });


    if(!userExist) {
        const error = new Error('User not found')
        return res.status(404).json({msg: error.message});
    }

    if(!userExist.confirm) {
        const error = new Error('User not confirmed');
        return res.status(403).json({msg: error.message})
    }

    // verificar si el password esta bien
    if(await userExist.comprobarPassword(password)) {
        res.json({
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            token: generateJWT(userExist._id)
        })
    } else {
        const error = new Error(`the Password isn't correct `)
        return res.status(403).json({msg: error.message})
    }
}

const confirmed = async (req, res) => {

    const {token} = req.params;
    console.log(token)

    const userExist = await User.findOne({ token })

    if(!userExist) {
        const error = new Error('Token not found')
        return res.status(404).json({msg: error.message});
    }

    try {
        userExist.confirm = true;
        userExist.token = '';
        await userExist.save()
        res.json({msg: 'User confirmed correctly'})
    } catch (error) {
        console.log(error)
    }


}

const forgotPassword = async (req, res) => {
    
    const {email} = req.body;

    const userExist = await User.findOne({ email })

    if(!userExist) {
        const error = new Error('User not found')
        return res.status(404).json({msg: error.message});
    }

    try {
        userExist.token = generateId();
        await userExist.save();

        //enviar email 
        // emailOlvidePassword({
        //     email: userExist.email,
        //     nombre: userExist.name,
        //     token: userExist.token
        // })
        res.json({msg: 'check your email'})
    } catch (error) {
        console.log(error)
    }

}


const checkToken = async (req, res) => {

    const {token} = req.params;

    const userExist = await User.findOne({token});

    if(!userExist) {
        const error = new Error('User not found or token not valid')
        return res.status(404).json({msg: error.message});
    } else {
        res.json({msg: 'Token is valid'})
    }



}

const newPassword = async (req, res) => {

    const { token } = req.params; 
    const { password } = req.body; //es el password nuevo que quiero y que estoy mandando

    const userExist = await User.findOne({ token });

    if(userExist) {
        userExist.token = "";
        userExist.password = password;

        try {
            await userExist.save()
            res.json({msg: 'Password was mofidificated correctly'})
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('User not found or token not valid')
        return res.status(404).json({msg: error.message});
    }

}

const profile = async (req, res) => {

    const { user } = req;

    res.json(user);
}

const addFriend = async (req, res) => {

    const { friendId } = req.body;

    const userFriendExist = await User.findById(friendId)

    //verificar si el usuario existe
    if(!userFriendExist) {
        const error = new Error('This user is not found');
        res.status(404).json({ msg: error.message})
    }

    //ver si ya son amigos
    if(req.user.friends.includes(friendId)) {
        const error = new Error('this user is a friend yet')
        res.status(404).json({msg: error.message})
    }

    if(req.user.friendrequest.includes(userFriendExist._id)) {

        const friendRequestUpdate = req.user.friendrequest.filter( friendsReq => friendsReq.toString() !== userFriendExist._id.toString())

        try {
            userFriendExist.friends.push(req.user._id)
            await userFriendExist.save()
            req.user.friendrequest = friendRequestUpdate;
            req.user.friends.push(userFriendExist._id)
            await req.user.save()
            res.json({msg: `${userFriendExist.name} and you are friends now`})
        } catch (error) {
            console.log(error)
        }
    }
}

const friendRequest = async (req, res) => {

    const { friendIdReq } = req.body;
    
    //console.log("hola")
    //console.log("reqUser", req.user)

    const userFriendExist = await User.findById(friendIdReq);

    //userFriendExist.friendRrequest = userFriendExist.friendRrequest || [];

    //console.log("friendrequest", userFriendExist.friendrequest)
    //console.log("friendrequest", userFriendExist.friends)

    //console.log(hola.hola)
    

    if(!userFriendExist) {
        const error = new Error('This user is not found');
        res.status(404).json({ msg: error.message})
    }

    if(!userFriendExist._id.toString() === req.user._id.toString()) {
        const error = new Error('Is the same usuario You cant this action');
        res.status(404).json({ msg: error.message})
    }
    try {
        //userFriendExist.friendRrequest = userFriendExist.friendRrequest || [];
        //console.log("amigosol2", userFriendExist.friendRrequest)

        userFriendExist.friendrequest.push(req.user._id)
        
        await userFriendExist.save();
        res.json({msg: "User has sent you a friend request"})
    } catch (error) {
        console.log(error)
    }
}

const getFriend = async (req, res) => {

    const {id} = req.params;
    console.log('IDamigo', id)

    const userFriend = await User.findById(id);

    if(!userFriend) {
        const error = new Error('User not found')
        return res.status(404).json({msg: error.message});
    }

    try {
        res.json({
            name: userFriend.name,
            imageProfile: userFriend.imageprofile,
            id: userFriend._id
        })
    } catch (error) {
        console.log(error)
    }
}

const uploadImageProfile = async (req, res) => {
    console.log(req.files)
    console.log('nameFOTO',req.files['photo'].name)
    
    try {
        const result = await uploadFile(req.files['photo'])
        req.user.imageprofile = req.files['photo'].name
        await req.user.save()
        res.json({result})
    } catch (error) {
        console.log(error)
    }
    


    //
    //console.log(result)

    //res.json({msg: 'Archivo subido'})
}

/*const readImageProfile = async (req, res) => {
    try {
        const result = await readFile(req.params.fileName)

        res.send('archivo descargado')
    } catch (error) {
        res.send(error)
    }
    const result = await readFile(req.params.filename)
}*/

const getImageUrl = async (req, res) => {
    try {
        const result = await getFileURL(req.user.imageprofile)
        console.log(result)
        res.json({result})
    } catch (error) {
        res.send(error)
    }
    //const result = await readFile(req.params.filename)
}

const getImageUrlFriend = async (req, res) => {
    try {
        const {image} = req.params;
        console.log(req.params)
        const result = await getFileURL(image)
        console.log('imagearchFriend', req.body)
        console.log(result)
        res.json({result})
    } catch (error) {
        res.send(error)
    }
    //const result = await readFile(req.params.filename)
}


// const getAllUsers = async (req, res) => {
//     try {
//         const allUsers = await User.find({confirm})
//     } catch (error) {
//         res.send(error)
//     }
//     //const result = await readFile(req.params.filename)
// }



export { 
    register, 
    authenticate, 
    confirmed, 
    forgotPassword, 
    checkToken, 
    newPassword, 
    profile, 
    addFriend, 
    friendRequest, 
    getFriend,
    uploadImageProfile,
    getImageUrl,
    getImageUrlFriend,
    //getAllUsers
} ;