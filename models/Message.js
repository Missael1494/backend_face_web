import mongoose from "mongoose";

const messageShema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    },
    {timestamps: true}
)

const Message = mongoose.model("Message", messageShema)
export default Message;
