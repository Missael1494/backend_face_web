import User from "../models/User.js"
import Conversation from "../models/Conversation.js"

const createConversation = async (req, res) => {

    const { OtherUserId } = req.body;


    const conversationExist = await Conversation.findOne({
       members: { $all: [req.user._id, OtherUserId] }
    })



    console.log("conversation", conversationExist)

    if(!conversationExist) {
        console.log("crear conversation")
        const newConversation = new Conversation({
            members: [req.user._id, OtherUserId]
        })
        try {
            const savedConversation = await newConversation.save();
            //res.status(200).json(savedConversation);
            res.json(savedConversation);
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(404).json({msg: "Error this conversation exist already"})
    }
}

const getOneConversation = async (req, res) => {
    const conversation = await Conversation.findOne({
        members: { $all: [req.user._id, req.params.secondUserId] },
    });
    
    try {
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }

}

const getAllConversations = async (req, res) => {
    const conversations = await Conversation.find({
        memebers: { $in: [req.user._id]}
    })
    //console.log('usuARIO', req.user._id) 
    //console.log('conversations', conversations)
    const arrayConversation = conversations.map( conversation => conversation.members.filter( userconv => userconv.toString() !== req.user._id.toString()))
    //const userConversation = arrayConversation.filter( me)
    //console.log('userconversation',arrayConversation)
    // memebersConversation =  arrayConversation.map( async user => {
    //     return await User.findById(user)
    // }) 

    const usersConversation = await Promise.all(
        arrayConversation.map(async user => {
            return await User.findById(user).select("-confirm -friends -friendrequest -token -createdAt -updatedAt -__v -password")
        })
    )
    console.log('uSUarios conversation', usersConversation)
    try {
        res.status(200).json(conversations)
    } catch (error) {
        console.log(error)
    }
}

export {createConversation, getOneConversation, getAllConversations}