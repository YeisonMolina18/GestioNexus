const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

// Configuración del cliente S3 para DigitalOcean Spaces
const spacesClient = new S3Client({
    endpoint: `https://${process.env.SPACES_ENDPOINT}`,
    region: "us-east-1", // Esta región es un valor estándar para la compatibilidad
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
    },
});

/**
 * Sube un archivo a DigitalOcean Spaces.
 * @param {object} file - El objeto de archivo de Multer (req.file).
 * @param {string} folder - La carpeta dentro del Space donde se guardará (ej: 'profiles').
 * @returns {Promise<string>} - La URL pública del archivo subido.
 */
const uploadFileToSpaces = async (file, folder) => {
    const fileStream = fs.createReadStream(file.path);
    
    // Genera un nombre de archivo único
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const params = {
        Bucket: process.env.SPACES_BUCKET,
        Key: fileName,
        Body: fileStream,
        ACL: "public-read", // Hace el archivo públicamente visible
        ContentType: file.mimetype,
    };

    try {
        await spacesClient.send(new PutObjectCommand(params));
        
        // Borra el archivo temporal del servidor
        fs.unlinkSync(file.path);

        // Retorna la URL pública del archivo
        const fileUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_ENDPOINT}/${fileName}`;
        return fileUrl;

    } catch (error) {
        console.error("Error subiendo archivo a Spaces:", error);
        // Borra el archivo temporal en caso de error
        fs.unlinkSync(file.path);
        throw new Error("No se pudo subir el archivo.");
    }
};

module.exports = {
    uploadFileToSpaces,
};