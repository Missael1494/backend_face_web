import express from "express";
import dotenv from 'dotenv';
import connectarDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import postRoutes from './routes/postRoutes.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'

const app = express();
app.use(express.json());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './archivos'
}));

app.use(express.static('images'))

dotenv.config();

connectarDB();

// Configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if(whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions));


//Routing
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes)

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})



