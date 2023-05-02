const Block = require('./block');
const generateHash  = require('../utility/crypto-hash');
const {REWARD_INPUT, MINING_RATE, REWARD_MINER} = require('../config');
const Transaction =  require('../Digital_wallet/transaction');
const Wallet = require('../Digital_wallet/wallet')


class Blockchain{
  constructor(){
    ///so it can start as genesis block
    this.chain = [Block.createGenesisBlock()];
  }

  addBlock({data}){

    const latestBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({ lastBlock: latestBlock, data });

    ///push the new create block into the chain
    this.chain.push(newBlock)
  }

  //replace the chain with the new validated one
  changeChain(newChain, validTransactions,onSuccess){
    //check the chain is not longer does not replace it
    if(newChain.length <= this.chain.length){
      console.error('The new chain should be Longer than the current one')
      return;
    }
    //if is not a valid chain does not replace it
    if(!Blockchain.isChainValid(newChain)){
      console.error('The new chain is not valid')
      return;
    }
    if(validTransactions && !this.validateTransactionData({chain: newChain})){
      console.error('New chain contains invalid transaction data')
      return;
    }
    if (onSuccess) onSuccess();
    console.log('new chain replaced:', newChain)
    this.chain = newChain;
  }
  validateTransactionData({chain}){
    for(let i=1; i<chain.length; i++){
      const block = chain[i];
      let transactionRewardTotal = 0;
      let allTransactionSet = new Set(); 

      for(let transaction of block.data){
        if(transaction.input.address === REWARD_INPUT.address){
          transactionRewardTotal++;

          if(transactionRewardTotal >1){
            console.error('Reward limit exceeded');
            return false;
          }
          if(Object.values(transaction.outputMap)[0] !== REWARD_MINER){
            console.error('amount for the reward is invalid');
            return false;
          } 
        }else{
          if(!Transaction.validTransaction(transaction)){
            console.error('Non valid transaction');
            return false;
          }

          const actualBalance = Wallet.balanceCalculation({
            chain:this.chain,
            address: transaction.input.address
          });

          if(transaction.input.amount !== actualBalance){
            console.error('the input is an invalid amount')
            return false;
          }
          if(allTransactionSet.has(transaction)){

            console.error('this transaction is already in the block')
            return false;
          }else{
            allTransactionSet.add(transaction)
          }
        }
      }
    }
    return true
  }

  static isChainValid(chain){
    //if the fist block is not == to the genesis return false 
    if(JSON.stringify(chain[0]) !==  JSON.stringify(Block.createGenesisBlock())) {
      return false;
    };
    ///loop in the chain
    for (let i=1; i<chain.length; i++){
      const block = chain[i];
      const currentLastHash = chain[i-1].hash;
      const previousDifficulty = chain[i-1].difficulty;

      const { timestamp, lastHash, hash, data, nonce, difficulty } = block;
      if(lastHash !== currentLastHash) return false;
      ///use the validate hash function to check the inputs 
      const isHashValid = generateHash(timestamp, lastHash, data, nonce, difficulty);
      ///compare the validate hash with the current hash 
      if (hash !== isHashValid) return false;

      if(Math.abs(previousDifficulty-difficulty)>1) return false //prevent difficulty to have gap to high or too low
    };
    return true;
  }

}

module.exports = Blockchain;