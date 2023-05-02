///hard coded and global value here
const MINING_RATE = 1000; ////millisecond = 1 second
const STARTING_DIFFICULTY = 3;
const INITIAL_BALANCE = 1000;

const REWARD_INPUT = {
 address: "reward-authorized"
}

const REWARD_MINER = 60;

const GENESIS_BLOCK_DATA = {
  timestamp: 1,
  lastHash: "****",
  hash: "first_hash_blockchain",
  difficulty: STARTING_DIFFICULTY,
  nonce:0,
  data: []
}

module.exports = {
  GENESIS_BLOCK_DATA, 
  MINING_RATE, 
  INITIAL_BALANCE,
  REWARD_INPUT, 
  REWARD_MINER 
};