import Post from '../models/Post.js'
import User from '../models/User.js'

const createPost = async (req, res) => {
    const {image, desc} = req.body;

    const newPost = new Post({
        userId: req.user_id,
        image, 
        desc
    })

    try {
        const savePost = await newPost.save()
        res.son(savePost)
    } catch (error) {
        console.log(error)
    }
}

const getUserPosts = async (req, res) => {
    
    try {
        const userPosts = await Post.find({
            userId: req.user._id
        })
        res.json(userPosts)
    } catch (error) {
        console.log(error)
    }
}

const getFriendsPosts = async (req, res) => {


    try {
        const friendPosts = await Promise.all(
            req.user.friends.map( (friend) => {
                return Post.find({ userId: friend._id})
            })
        )
        res.json(friendPosts)
    } catch (error) {
        console.log(error)
    }
}

const disOrLikePost = async (req, res) => {
    //const {PostLikeId} = req.body;

    const postLiked = await Post.findById(req.params.idPost)
    console.log("postLiked", postLiked)

    try {
        if(postLiked.likes.includes(req.user._id)){
            const postUpdateLikes = postLiked.likes.filter( like => like.toString() !== req.user._id.toString())
            postLiked.likes = postUpdateLikes;
            const updatePost = await postLiked.save()
            res.json({msg: `${updatePost.length} like your post`})
        } else {
            const updatePost = postLiked.likes.push(req.user._id)
            await updatePost.save()
            res.json({msg: `${updatePost.length} like your post`})
        }
        
    } catch (error) {
        
    }
}

const deletePost = async (req, res) => {

        try {
            const post = await Post.findById(req.params.idPost)
            console.log("postLiked", postLiked)

            if(postDelete.userId.toString() === req.user._id.toString() ) {
                await post.deleteOne();
                res.json({msg: "the post has been deleted"})
            } else {
                res.status(404).json({msg : 'you can not delete this post'})
            }

            
        } catch (error) {
            console.log(error)
        }
    
}

export { createPost, getUserPosts, getFriendsPosts, disOrLikePost, deletePost }