import express from "express"
import {
    createPost,
    getUserPosts,
    getFriendsPosts,
    disOrLikePost,
    deletePost
}   from '../controllers/postControllers.js'
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.post('/create-post', checkAuth, createPost)
router.get('/get-user-Posts', checkAuth, getUserPosts)
router.get('/friends-posts', checkAuth, getFriendsPosts)
router.put('/like/:idPost', checkAuth, disOrLikePost)
router.delete('/delete/:idPost', checkAuth, deletePost)



export default router;