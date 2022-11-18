import express from 'express'
import { 
    createConversation,
    getOneConversation,
    getAllConversations,
} from "../controllers/conversationController.js"
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.post("/create-Conversation", checkAuth, createConversation)
//     .get(checkAuth, getConversation)
//     .post(checkAuth, createConversation)
router.get('/conversation/:secondUserId',checkAuth, getOneConversation)

router.get('/allConversations',checkAuth, getAllConversations)


export default router;