const crypto = require('crypto')

const hashedPassword = (input) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const encryptedPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex');
    return {
        salt,
        encryptedPassword
    }
}
const comparePassword = ({ input, encryptedPassword, salt }) => {
    const hashedRawPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex');
    return encryptedPassword === hashedRawPassword;
};
module.exports = {
    hashedPassword,
    comparePassword
}