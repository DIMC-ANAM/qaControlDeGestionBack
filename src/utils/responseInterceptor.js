const crypto = require('crypto');

// Usar crypto nativo de Node.js
const ALGORITHM = 'aes-256-gcm';
const MAX_RESPONSE_SIZE = 5 * 1024 * 1024; // 5MB límite para encriptar

// Derivar clave usando PBKDF2 
function deriveKey(password, salt, iterations = 100000) {
    return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
}

const SECRET_KEY = deriveKey(
    process.env.SECRETKEY || 'my-secret-key',
    'salt',
    100000
);

function encryptData(data) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
        
        const encrypted = Buffer.concat([
            cipher.update(data, 'utf8'),
            cipher.final()
        ]);
        
        const authTag = cipher.getAuthTag();
        
        return Buffer.concat([iv, authTag, encrypted]).toString('base64');
    } catch (error) {
        console.error('Error al encriptar:', error.message);
        return null;
    }
}

function responseInterceptor(req, res, next) {
    // Lista de rutas que NO deberían encriptarse
    const skipEncryption = [
		'/user/'
        //'/token/generateToken',
        
    ];

    if (!skipEncryption.some(path => req.path.startsWith(path))) {
        return next();
    }

    // Bandera para evitar bucles infinitos
    const isAlreadyIntercepted = res.__encryptionIntercepted;
    if (isAlreadyIntercepted) {
        return next();
    }
    res.__encryptionIntercepted = true;

    const originalJson = res.json;

    // Solo interceptar res.json()
    res.json = function(data) {
        try {
            // Evitar re-encriptar respuestas ya encriptadas
            if (data && data.encrypted === true) {
                return originalJson.call(this, data);
            }

            const jsonString = JSON.stringify(data);
            const dataSize = Buffer.byteLength(jsonString, 'utf8');

            // Si la respuesta es muy grande, no encriptar
            if (dataSize > MAX_RESPONSE_SIZE) {
                console.warn(`Response demasiado grande (${(dataSize/1024).toFixed(2)} KB), enviando sin encriptar. Endpoint: ${req.path}`);
                return originalJson.call(this, data);
            }

            const encrypted = encryptData(jsonString);
            
            if (encrypted) {
                return originalJson.call(this, { 
                    encrypted: true,
                    data: encrypted 
                });
            } else {
                console.warn('Encriptación falló, enviando datos originales');
                return originalJson.call(this, data);
            }
        } catch (error) {
            console.error('Error en interceptor:', error.message);
            return originalJson.call(this, data);
        }
    };

    next();
}

module.exports = responseInterceptor;