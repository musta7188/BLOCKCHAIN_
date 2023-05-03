const Transaction = require("../Digital_wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactionToBlock() {
    ///get the transactions pool's valid transactions
    const getValidTransactions = this.transactionPool.getValidTransactions();

    //generate the miners reward
    getValidTransactions.push(
      Transaction.createRewardTransaction({ minerWallet: this.wallet })
    );

    // add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: getValidTransactions });

    //broadcast the updated blockchain
    this.pubsub.broadcastUpdatedBlockchain();

    // clear the pool
    this.transactionPool.emptyTransactionStorage();
  }
}

module.exports = TransactionMiner;
