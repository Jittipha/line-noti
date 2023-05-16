const crypto = require('crypto')
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY =Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
function encrypt(text) {
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('base64') + ':' + encrypted.toString('base64');
    } catch (err) {
        console.log(err)
    }
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'base64');
        let encryptedText = Buffer.from(textParts.join(':'), 'base64');
        let decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    encrypt,
    decrypt,
};