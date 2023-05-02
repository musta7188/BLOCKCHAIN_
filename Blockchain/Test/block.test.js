const fromHexToBinary = require("hex-to-binary");
const Block = require("../block");
const { GENESIS_BLOCK_DATA, MINING_RATE } = require("../../config");
const generateHash = require("../../utility/crypto-hash");

///test to pass the block class and what does it aspect as input
describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "test-lastHash";
  const hash = "test-hash";
  const data = ["blockchain", "data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  it("has a timestamp, lastHash, hash, and data", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  //test for the genesis function
  describe("createGenesisBlock()", () => {
    const genesisBlock = Block.createGenesisBlock();

    it("returns Block instance", () => {
      //instanceOf return a boolean value
      expect(genesisBlock).toBeInstanceOf(Block);
    });

    it("returns genesis data", () => {
      ///as JS implement classes as object under the hood important that both has the same
      ////properties (keys and value)
      expect(genesisBlock).toEqual(GENESIS_BLOCK_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.createGenesisBlock();
    const data = "data mining";
    const miningBlock = Block.mineBlock({
      lastBlock: lastBlock,
      data: data,
    });

    it("Block instance", () => {
      expect(miningBlock).toBeInstanceOf(Block);
    });

    it("sets the `lastHas` to be the `hash` of the lastBlock", () => {
      expect(miningBlock.lastHash).toEqual(lastBlock.hash);
    });

    it(" sets the `data`", () => {
      expect(miningBlock.data).toEqual(data);
    });

    it(" sets the `timestamp`", () => {
      //ensure we do not get undefined as result
      expect(miningBlock.timestamp).toBeDefined();
    });

    it("generate SHA-256 `hash` based on its own input", () => {
      expect(miningBlock.hash).toEqual(
        generateHash(
          miningBlock.timestamp,
          miningBlock.nonce,
          miningBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("set the `hash` that match the difficulty criteria", () => {
      ///up to zeros equal to that difficulty
      expect(
        fromHexToBinary(miningBlock.hash).substring(0, miningBlock.difficulty)
      ).toEqual("0".repeat(miningBlock.difficulty));
    });

    it("set the difficulty", () => {
      const poolOfResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      expect(poolOfResults.includes(miningBlock.difficulty)).toBe(true);
    });
  });

  describe("setDifficulty()", () => {
    it("raise the difficulty if the block is mined quickly", () => {
      expect(
        Block.setDifficulty({
          previousBlock: block,
          timestamp: block.timestamp + MINING_RATE - 100, // we are making ti lower by substracting 100ms
        })
      ).toEqual(block.difficulty + 1); //expect the difficulty to rise
    });

    it("low the difficulty if the block is mined slowly", () => {
      expect(
        Block.setDifficulty({
          previousBlock: block,
          timestamp: block.timestamp + MINING_RATE + 100,
        })
      ).toEqual(block.difficulty - 1); //expect difficulty to slow
    });

    it(" limit must be at least 1", () => {
      block.difficulty = -1;

      expect(Block.setDifficulty({ previousBlock: block })).toEqual(1);
    });
  });
});
