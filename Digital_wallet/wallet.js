const Transaction = require('./transaction')
const {INITIAL_BALANCE} = require('../config');
const {elliptic_cryptography} = require('../utility');
const generateHash = require('../utility/crypto-hash')

class Wallet {

  constructor(){
    this.balance = INITIAL_BALANCE; ////every wallet start with a balance

    this.keyPair = elliptic_cryptography.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data){
    return this.keyPair.sign(generateHash(data))
  };

  createTransaction({recipient: recipientAddress, amount: transactionAmount,chain}){

    if(chain){
      this.balance = Wallet.balanceCalculation({
        chain,
        address: this.publicKey
      });
    }

    if(transactionAmount > this.balance){
      throw new Error('Amount is greater than available balance');
    };
    
    return new Transaction({senderWallet: this, recipient: recipientAddress, amount: transactionAmount});
  };

  static balanceCalculation({chain, address}){
    let transactionExists = false;
    let totalOutputAmount = 0;

    for(let i=chain.length-1; i>0; i--){
      const block = chain[i];

      for(let transaction of block.data){
        if(transaction.input.address === address){
          transactionExists = true
        }
        const outputAddress  = transaction.outputMap[address];

        if(outputAddress){
          totalOutputAmount +=outputAddress;
        }
      }

      if(transactionExists){
        break;
      }
    }
    return transactionExists? totalOutputAmount: INITIAL_BALANCE + totalOutputAmount;
  };
};

module.exports = Wallet;