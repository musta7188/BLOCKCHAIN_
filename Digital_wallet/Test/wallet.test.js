const Wallet = require('../Wallet');
const Transaction = require('../transaction');
const { INITIAL_BALANCE } = require('../../config');
const { signatureVerification } = require('../../utility');

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('has an initial balance', () => {
    expect(wallet.balance).toEqual(INITIAL_BALANCE);
  });

  it('has a public key', () => {
    expect(wallet.publicKey).toBeTruthy();
  });

  describe('sign()', () => {
    const data = 'test-data';

    it('signs data using the wallet private key', () => {
      const signature = wallet.sign(data);
      const isValid = signatureVerification({
        publicKey: wallet.publicKey,
        data,
        signature,
      });

      expect(isValid).toBe(true);
    });
  });

  describe('createTransaction()', () => {
    let recipientAddress, transactionAmount, transaction;

    beforeEach(() => {
      recipientAddress = 'recipient-address';
      transactionAmount = 50;

      transaction = wallet.createTransaction({
        recipient: recipientAddress,
        amount: transactionAmount,
      });
    });

    it('creates a transaction with the correct recipient and amount', () => {
      expect(transaction.outputMap[recipientAddress]).toEqual(transactionAmount);
    });

    it('creates a transaction with the correct sender', () => {
      expect(transaction.input.address).toEqual(wallet.publicKey);
    });

    it('returns an instance of the Transaction class', () => {
      expect(transaction).toBeInstanceOf(Transaction);
    });

    describe('when the transaction amount is greater than the wallet balance', () => {
      beforeEach(() => {
        transactionAmount = wallet.balance + 100;
      });

      it('throws an error', () => {
        expect(() => {
          wallet.createTransaction({ recipient: recipientAddress, amount: transactionAmount });
        }).toThrow('Amount is greater than available balance');
      });
    });
  });

  describe('balanceCalculation()', () => {
    // Add test cases for the balanceCalculation() method
  });
});
