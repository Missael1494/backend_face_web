import express from "express";
import {
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
    //readImageProfile,
    getImageUrl,
    getImageUrlFriend
} from '../controllers/userController.js'
import checkAuth from "../middleware/checkAuth.js";
//import fileUpload from 'express-fileupload'


const router = express.Router();

// autenticate and register and user Confirmed
router.post('/', register)
router.post("/login", authenticate)
router.get('/confirmed/:token', confirmed)
router.post('/password-forgot', forgotPassword)
router.route('/forgot-password/:token').get(checkToken).post(newPassword);


router.get('/profile', checkAuth, profile)


router.post('/addFriend', checkAuth, addFriend)
router.post('/friend-request', checkAuth, friendRequest)
router.get('/profile-friend/:id', checkAuth, getFriend)

router.post('/upload-imageProfile', checkAuth, uploadImageProfile)
// router.get('/get-image-profile/:fileName', checkAuth, readImageProfile )
router.get('/get-imageUrl-profile', checkAuth, getImageUrl )
router.get('/get-imageUrlFriend-profile/:image',checkAuth ,getImageUrlFriend)


export default router;