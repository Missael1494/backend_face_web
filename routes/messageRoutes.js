import express from "express"
import {
    createMessage,
    getMessages
} from "../controllers/messageController.js"
import checkAuth from '../middleware/checkAuth.js'


const router = express.Router()

router.post('/create-message', checkAuth, createMessage)

router.get('/:conversationId', checkAuth, getMessages)

export default router;