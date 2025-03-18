import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { uploadExternalFiles } from '../controllers/asset.js';


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY,
    }
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, `${req.user.uuid}/${file.originalname}`); //use Date.now() for unique file keys
        }
    })
});

const AssetRoutes = Router();


AssetRoutes.post('/upload', authMiddleware, upload.array('files', 25), function (req, res, next) {
    res.send({
        message: "Uploaded!",
        urls: req.files.map(function (file) {
            return { url: file.location, name: file.key, type: file.mimetype, size: file.size };
        })
    });
});

AssetRoutes.post('/upload-external', authMiddleware, async (req, res) => {
    res.send({
        message: "Uploaded!",
        urls: await uploadExternalFiles(req, req.body.files)
    });
});

export default AssetRoutes;