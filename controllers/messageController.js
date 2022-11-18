import User from '../models/User.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'

const createMessage = async(req, res) => {
    const { conversationId, text, sender } = req.body;
    //sender = req.user;


    const newMessage = new Message({
        conversationId,
        text,
        sender: req.user._id
    });

    try {
        const saveMessage = await newMessage.save()
        res.status(200).json(saveMessage)
    } catch (error) {
        console.log(error)
    }

}

const getMessages = async (req, res) => {

    // const {conversationId} = req.params;

    // const messages = await Message.find({
    //     conversationId
    // })
    //console.log("obtener mensajes")
    //console.log("ConversationID", req.params.conversationId)

    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
    }
}

export {createMessage, getMessages}