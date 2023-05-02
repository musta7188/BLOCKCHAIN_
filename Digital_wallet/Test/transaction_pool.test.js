const TransactionPool = require('../transaction_pool');
const Transaction = require('../transaction');
const Wallet = require('../Wallet');

describe('TransactionPool', () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    const recipient = 'recipient-address';
    const amount = 50;

    transaction = senderWallet.createTransaction({ recipient, amount });
  });

  describe('storeTransaction()', () => {
    it('adds a transaction to the transaction pool', () => {
      transactionPool.storeTransaction(transaction);

      expect(transactionPool.transactionMapping[transaction.id]).toBe(transaction);
    });
  });

  describe('updateMapping()', () => {
    it('updates the transaction pool with a given transaction mapping', () => {
      const transactionMapping = { [transaction.id]: transaction };
      transactionPool.updateMapping(transactionMapping);

      expect(transactionPool.transactionMapping).toEqual(transactionMapping);
    });
  });

  describe('findExistingTransaction()', () => {
    it('finds a transaction with a given input address', () => {
      transactionPool.storeTransaction(transaction);
      const foundTransaction = transactionPool.findExistingTransaction({ inputAddress: senderWallet.publicKey });

      expect(foundTransaction).toEqual(transaction);
    });
  });

  describe('getValidTransactions()', () => {
    let validTransaction, errorTransaction;

    beforeEach(() => {
      validTransaction = transaction;
      errorTransaction = Transaction.createRewardTransaction({ minerWallet: senderWallet });

      transactionPool.storeTransaction(validTransaction);
      transactionPool.storeTransaction(errorTransaction);
    });

    it('returns only valid transactions', () => {
      const validTransactions = transactionPool.getValidTransactions();

      expect(validTransactions).toEqual([validTransaction]);
    });
  });

  describe('emptyTransactionStorage()', () => {
    it('empties the transaction pool', () => {
      transactionPool.emptyTransactionStorage();

      expect(transactionPool.transactionMapping).toEqual({});
    });
  });

  describe('clearBlockchainTransactions()', () => {
    it('removes transactions in the pool that are already in the blockchain', () => {
      const blockchainMock = {
        chain: [{}, { data: [transaction] }],
      };

      transactionPool.storeTransaction(transaction);
      transactionPool.clearBlockchainTransactions({ chain: blockchainMock.chain });

      expect(transactionPool.transactionMapping[transaction.id]).toBeUndefined();
    });
  });
});
