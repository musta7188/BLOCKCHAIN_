const fromHexToBinary = require("hex-to-binary");
const { GENESIS_BLOCK_DATA, MINING_RATE } = require("../config");
const generateHash = require("../utility/crypto-hash");

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }
  //to use in the static content

  static createGenesisBlock() {
    //use genesis data as data for the new block
    ///this keyword here refer to the block itself or the Block class
    //when genesis is called this is how the first block is created
    return new this(GENESIS_BLOCK_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    let nonce = 0;

    do {
      ///keep increasing the nonce and insert the data until the hash with the difficulty
      ///requirement is met
      nonce++;
      timestamp = Date.now();
      //create difficulty relevant to the time stamp and the last block
      difficulty = Block.setDifficulty({ previousBlock: lastBlock, timestamp });
      hash = generateHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      fromHexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    ); //create the data has for the new block
    ///from hex to binary make the search to look for the binary for of the hash to make the difficulty time close to the high one set
    ////now is based on binary hashes
    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  ///set the difficulty
  static setDifficulty({ previousBlock, timestamp }) {
    const difficulty = previousBlock.difficulty;

    const variance = timestamp - previousBlock.timestamp;

    if (difficulty < 1) return 1;
    ///prevent difficulty to fo below zero, ensure it has at least 1 leading zero
    if (variance > MINING_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

// to share this file with other files
module.exports = Block;
