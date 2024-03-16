import dotenv from 'dotenv'
dotenv.config();
import pkg from 'aws-sdk';
const { Endpoint, S3 } = pkg;

async function getCurrentUTCTimestamp() {
    const now = new Date();
    const utcTimestamp = now.toISOString();
    return utcTimestamp;
}

const endpoint = process.env.endpoint
const spacesEndpoint = new Endpoint(endpoint);

const s3 = new S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
});

const bucket = process.env.bucket;
async function uploadImageToS3(file) {
    const params = {
        Bucket: bucket,
        Key: `R-world_images/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
    };

    const uploadPromise = s3.upload(params).promise();
    const uploadResponse = await uploadPromise;
    const imageUrl = uploadResponse.Location;

    return imageUrl;
}

export { getCurrentUTCTimestamp, uploadImageToS3 }