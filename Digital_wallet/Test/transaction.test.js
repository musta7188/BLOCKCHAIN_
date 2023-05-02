const Transaction = require('../transaction'); 
const Wallet = require('../wallet'); 
const { REWARD_INPUT, REWARD_MINER } = require('../../config'); 
describe('Transaction', () => {
  let senderWallet, recipient, amount, transaction;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = 'recipient-public-key';
    amount = 50;

    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it('has an `id`', () => {
    expect(transaction).toHaveProperty('id');
  });

  describe('outputMap', () => {
    it('has an `outputMap`', () => {
      expect(transaction).toHaveProperty('outputMap');
    });

    it('outputs the `amount` to the `recipient`', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it('outputs the remaining balance for the `senderWallet`', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    });
  });

  describe('update()', () => {
    let originalSenderOutput, nextRecipient, nextAmount;

    beforeEach(() => {
      originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
      nextRecipient = 'next-recipient-public-key';
      nextAmount = 20;

      transaction.update({ senderWallet, recipient: nextRecipient, amount: nextAmount });
    });

    it('outputs the `nextAmount` to the `nextRecipient`', () => {
      expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
    });

    it('subtracts the `nextAmount` from the `senderWallet` balance', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
    });
  });

  describe('createRewardTransaction()', () => {
    let minerWallet, rewardTransaction;

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.createRewardTransaction({ minerWallet });
    });

    it('creates a transaction with the reward input', () => {
      expect(rewardTransaction.input).toEqual(REWARD_INPUT);
    });

    it('creates a transaction for the miner with the `REWARD_MINER`', () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(REWARD_MINER);
    });
  });
});
