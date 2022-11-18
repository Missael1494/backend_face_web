import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import fs from 'fs'
import dotenv from 'dotenv';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'


dotenv.config();

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;



const client = new S3Client({ region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    }

});


async function uploadFile(file) {
    console.log('file', file.name)
    //console.log('frontend', process.env.FRONTEND_URL)
    
    const stream = fs.createReadStream(file.tempFilePath)
    //console.log(stream)

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream,
    }

    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)
}

// async function readFile(fileName){
//     const command = new GetObjectCommand({
//         Bucket: AWS_BUCKET_NAME,
//         Key: fileName
//     })
//     const result = await client.send(command)

//     result.Body.pipe(fs.createWriteStream('./images/newimage.png')) //guardando los datos de apoco y guardandolo en ese archivo
//     //const newFile = fs.createWriteStream('./images/newimage.png')
//     //fs.createReadStream(result.Body.stream).pipe(newFile)
//     return await client.send(command)
// }



async function getFileURL(fileName){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    })

    return await getSignedUrl(client, command, {expiresIn: 3600})
}

export {
    uploadFile,
    //readFile,
    getFileURL
}