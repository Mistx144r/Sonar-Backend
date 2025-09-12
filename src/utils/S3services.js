import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadFile(specificFolder, file) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const key = specificFolder ? `${specificFolder}/${fileName}` : fileName;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    return `${CLOUDFRONT_URL}/${key}`;
}

export async function deleteFile(url) {
    if (!url) return;

    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1);

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    await s3.send(command);
}