const Transaction = require('./transaction')

class TransactionPool {
  constructor(){
    this.transactionMapping = {};
  }


  storeTransaction(transaction){

    this.transactionMapping[transaction.id] = transaction;
  }

  updateMapping(transactionMapping){

     
    this.transactionMapping = transactionMapping;
  }

  findExistingTransaction({inputAddress}){

    return Object.values(this.transactionMapping).find(transaction => transaction.input.address === inputAddress);

  }

  getValidTransactions(){
   return Object.values(this.transactionMapping).filter(
      transaction => Transaction.validTransaction(transaction)
      )

      // return Object.values(this.transactionMapping).filter(Transaction.validTransaction);
  }

  emptyTransactionStorage(){
    this.transactionMapping = {}
  }

  ///miner will call this when a new blockchain instance is replaced
  ///as the clear method is not safe and my delete all transactions not still mined 
  clearBlockchainTransactions({ chain }) {
    for (const block of chain.slice(1)) {
      for (const transaction of block.data) {
        if (this.transactionMapping[transaction.id]) {
          delete this.transactionMapping[transaction.id];
        }
      }
    }
  }
}

module.exports = TransactionPool;