const crypto = require('crypto');

const generateHash = (...inputs) => {
    //create the hash object 
  const hashObject = crypto.createHash('sha256');
    ///join all the data in 1 string 
  //mappinig over the inputs and turn all the intern items in their stringify form
  const stringifySortedData = inputs.map(input => JSON.stringify(input)).sort();
  const combinedString = stringifySortedData.join(' ');

  hashObject.update(combinedString);
    //return the result in hex (in cryptografy digest is a way to rapresent the result of a hash)
  return hashObject.digest('hex');
};

module.exports = generateHash;