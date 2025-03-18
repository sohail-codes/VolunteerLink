import { PutObjectCommand , S3Client} from "@aws-sdk/client-s3";
import axios from "axios";
import path from 'path';

const s3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        secretAccessKey: process.env.AWS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY,
    }
});

export const uploadExternalFiles = async ( req,fileUrls) => {
    const uploadResults = await Promise.all(fileUrls.map(async (url) => {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const contentType = response.headers['content-type'];
            const fileBuffer = Buffer.from(response.data);
            const originalFileName = path.basename(new URL(url).pathname);
            const fileName = `${req.user.uuid}/${originalFileName}`;
            
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: fileBuffer,
                ContentType: contentType,
                ACL: 'public-read'
            };

            await s3.send(new PutObjectCommand(uploadParams));
            return { url: `https://volunteerlink.s3.ap-south-1.amazonaws.com/${fileName}`, name: fileName, type: contentType, size: fileBuffer.length };
        } catch (error) {
            console.error(`Failed to upload ${url}:`, error);
            return { url, error: 'Failed to upload' };
        }
    }));
    return uploadResults;

}