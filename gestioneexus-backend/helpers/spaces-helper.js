const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const spacesClient = new S3Client({
    endpoint: `https://${process.env.SPACES_ENDPOINT}`,
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
    },
});

const uploadFileToSpaces = async (file, folder) => {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const params = {
        Bucket: process.env.SPACES_BUCKET,
        Key: fileName,
        Body: file.buffer, // Usamos el buffer del archivo en memoria
        ACL: "public-read",
        ContentType: file.mimetype,
    };

    try {
        await spacesClient.send(new PutObjectCommand(params));
        const fileUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_ENDPOINT}/${fileName}`;
        return fileUrl;
    } catch (error) {
        console.error("Error subiendo archivo a Spaces:", error);
        throw new Error("No se pudo subir el archivo.");
    }
};

module.exports = {
    uploadFileToSpaces,
};