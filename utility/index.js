const Elliptic = require('elliptic').ec;  //Elliptic  cryptografy object
const generateHash = require('./crypto-hash')
//standards of efficient cryptography, Prime 256 bits, use a prime number to generate the curve
//this prime number is 256 bits (53)

const elliptic_cryptography = new Elliptic('secp256k1'); 

const signatureVerification = ({publicKey, data, signature}) => {

  const publicKeyObject = elliptic_cryptography.keyFromPublic(publicKey, 'hex');
  const dataHash = generateHash(data);

  return publicKeyObject.verify(dataHash, signature);

};


module.exports = {elliptic_cryptography, signatureVerification}

