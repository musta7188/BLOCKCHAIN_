const Blockchain = require("../blockchain");
const Block = require("../block");
const generateHash = require("../../utility/crypto-hash");
const Wallet = require("../../Digital_wallet/wallet");
const Transaction = require("../../Digital_wallet/transaction");

describe("Blockchain", () => {
  let blockchain;
  let newChain;
  let originalChain;
  let errorMock;

  //before each test will run a new instance of the block
  beforeEach(() => {
    errorMock = jest.fn();
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
    global.console.error = errorMock;
  });

  it("contain a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.createGenesisBlock());
  });

  it("add a new block to the chain", () => {
    const newDataBlock = "hello world";

    blockchain.addBlock({ data: newDataBlock });
    //get the last block and check if the data is equal to the added data
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
      newDataBlock
    );
  });

  describe(`isChainValid()`, () => {
    describe("if the chain not starting with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "wrong-genesis-block" };

        expect(Blockchain.isChainValid(blockchain.chain)).toBe(false);
      });
    });

    describe("if chain starts with genesis block and contain multiple block", () => {
      ///as can be more reason for chain to have invalid block

      ///DRY
      beforeEach(() => {
        blockchain.addBlock({ data: "Hello" });
        blockchain.addBlock({ data: "Rock" });
        blockchain.addBlock({ data: "Wall" });
      });

      describe("lastHas reference has changed", () => {
        it("returns false", () => {
          ///mess up with the block in the chain

          blockchain.chain[2].lastHash = "wrong-lastHash";

          expect(Blockchain.isChainValid(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain has a block with a invalid field", () => {
        it("returns false", () => {
          blockchain.chain[1].data = "fake-wrong-data";

          expect(Blockchain.isChainValid(blockchain.chain)).toBe(false);
        });
      });

      describe("if the chain has a big gap in the difficulty", () => {
        it("return false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];

          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3; ///create gap in difficulty

          const hash = generateHash(
            timestamp,
            lastHash,
            difficulty,
            nonce,
            data
          );

          const attackerBlock = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });

          blockchain.chain.push(attackerBlock);
          expect(Blockchain.isChainValid(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain has no invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isChainValid(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("changeChain()", () => {
    let logMock;
    beforeEach(() => {
      logMock = jest.fn();

      global.console.log = logMock;
    });

    //we do not change if is not longer
    describe("if the new chain is not longer than the current", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "new_chain" };

        blockchain.changeChain(newChain.chain);
      });

      it("do not change the chain with the new one", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("show an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("if the new chain is longer than the current", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Hello" });
        newChain.addBlock({ data: "Rock" });
        newChain.addBlock({ data: "Wall" });
      });

      describe("the new chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "wrong-hash";

          blockchain.changeChain(newChain.chain);
        });

        it("do not change the chain with the new one", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("show an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("the new chain is valid", () => {
        beforeEach(() => {
          blockchain.changeChain(newChain.chain);
        });
        it("do change the chain with the new one", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("advice that the chain was replaced", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("validateTransactionData()", () => {
    let transaction, transactionReward, wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: "test-address",
        amount: 55,
      });
      transactionReward = Transaction.createRewardTransaction({
        minerWallet: wallet,
      });
    });

    describe("data in the transaction is valid", () => {
      it("return true", () => {
        newChain.addBlock({ data: [transaction, transactionReward] });

        expect(
          blockchain.validateTransactionData({ chain: newChain.chain })
        ).toBe(true);
      });
    });

    describe("multiple reward found in the same transaction", () => {
      it("returns false and error is logged", () => {
        newChain.addBlock({
          data: [transaction, transactionReward, transactionReward],
        });

        expect(
          blockchain.validateTransactionData({ chain: newChain.chain })
        ).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("at least one malformed outputMap si in the transaction", () => {
      describe("the transaction is not a transaction reward type", () => {
        it("returns false and error is logged", () => {
          transaction.outputMap[wallet.publicKey] = 88888;

          newChain.addBlock({ data: [transaction, transactionReward] });

          expect(
            blockchain.validateTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("the transaction is a reward transaction type", () => {
        it("returns false and error is logged", () => {
          transactionReward.outputMap[wallet.publicKey] = 77777;

          newChain.addBlock({ data: [transaction, transactionReward] });

          expect(
            blockchain.validateTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe("at least one malformed input is in the transaction data", () => {
      it("returns false and error is logged", () => {
        wallet.balance = 70000;

        const scamOutputMap = {
          [wallet.publicKey]: 9889,
          testRecipient: 100,
        };

        const scamTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(scamOutputMap),
          },
          outputMap: scamOutputMap,
        };

        newChain.addBlock({ data: [scamTransaction, transactionReward] });
        expect(
          blockchain.validateTransactionData({ chain: newChain.chain })
        ).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("there are multiple similar transaction in the block", () => {
      it("returns false and error is logged", () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, transaction],
        });

        expect(
          blockchain.validateTransactionData({ chain: newChain.chain })
        ).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
