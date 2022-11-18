import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,

    },
    desc: {
        type: String,
        max: 500,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    
    },
    { timestamps: true }
)


const Post = mongoose.model("Post", postSchema);
export default Post;