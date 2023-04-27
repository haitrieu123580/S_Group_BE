const crypto = require('crypto')
const rawPassword = 'trieu'
// // Hashing with SHA-512 algorithm

// function hashWithSHA512(input) {
//     const output = crypto
//         .createHash('sha512')
//         .update(input) //hash input theo thuat toan da chon
//         .digest('hex') //
//     return output

// }
// function hashWithRandomSalt(input) {
//     const salt = crypto.randomBytes(16).toString('hex');
//     const output = crypto
//         .pbkdf2Sync(
//             input, 
//             salt, 
//             1000, 
//             64, 
//             'sha512',
//         ).toString('hex')
//     return output
// }
const password = 'pwd';
// const salt = crypto.randomBytes(16).toString('hex');
const salt = 'trieu'
const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

console.log({
	salt,
	hashedPassword,
});

// Get hash & salt from storage

const comparePassword = ({ encryptedPassword, password, salt }) => {
    console.log(encryptedPassword);
	const hashedRawPassword = crypto.pbkdf2Sync(password, salt, 10, 64, `sha512`).toString(`hex`);
    console.log(hashedPassword);
  return encryptedPassword === hashedRawPassword;
};

const encryptedPassword = hashedPassword

const isPasswordMatch = comparePassword({ encryptedPassword, password, salt });
console.log(isPasswordMatch);
if (isPasswordMatch) {
	console.log('Okay');
} else {
	console.log('Ewww hacker?');
}
// // hashedPassword = hashWithSHA512(rawPassword)
// // console.log(hashedPassword)
// // hashedPasswordSalt = hashWithRandomSalt(rawPassword)
// // console.log(hashedPasswordSalt)

// const key = crypto.generateKeyPairSync(
//     'rsa',
//     { modulusLength: 2048 }
// );

// const publicKey = key.publicKey;
// const privateKey = key.privateKey;
// // Encrypt data with public key
// const encryptedData = crypto.publicEncrypt(
//     {
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: "sha256",
//     },
//     Buffer.from(rawPassword)
// ).toString('base64')

// console.log({ encryptedData })
// // // decrypt data with private key
// const decryptedData = crypto.privateDecrypt(
//     {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: 'sha256',
//     },
//     Buffer.from(encryptedData, 'base64')
// ).toString()

// console.log({ decryptedData })
