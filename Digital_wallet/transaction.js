const uuid = require('uuid/v1')
const {signatureVerification} =require('../utility')
const { REWARD_INPUT, REWARD_MINER } = require('../config');
class Transaction {
  constructor({senderWallet, recipient, amount, outputMap, input}){

    this.id = uuid();
    this.outputMap = outputMap || this.createOutputMap({senderWallet, recipient, amount});
    this.input = input || this.createInput({senderWallet, outputMap: this.outputMap});

  }

  ///return a key value pare of output map {}
  createOutputMap({ senderWallet, recipient, amount }) {
    return {
      [recipient]: amount,
      [senderWallet.publicKey]: senderWallet.balance - amount,
    };
  }

  createInput({senderWallet, outputMap}){
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  update({senderWallet, recipient, amount}){
    if(amount > this.outputMap[senderWallet.publicKey]){
      throw new Error('Amount is greater than available balance')
    }

    this.outputMap[recipient] = this.outputMap[recipient] ? this.outputMap[recipient] + amount : amount;
    this.outputMap[senderWallet.publicKey] -= amount;
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static validTransaction(transaction){

    const {input, outputMap} = transaction;
    const {address, amount, signature} = input;
    const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total+outputAmount);


    if(amount !== outputTotal){
      console.error(`Invalid transaction from ${address}`)
      return false;
    }

    if(!signatureVerification({publicKey: address, data: outputMap, signature})){
      console.error(`Invalid signature from ${address}`)
      return false;
    }

    return true;
  }

  static createRewardTransaction({minerWallet}){
    return new this({
      input: REWARD_INPUT,
      outputMap:{[minerWallet.publicKey]: REWARD_MINER}
    })
  }

}

module.exports = Transaction;