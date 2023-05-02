const Blockchain = require('../Blockchain/blockchain');

const blockchain = new Blockchain();
blockchain.addBlock({data:"first-block-data"});

console.log('first block', blockchain.chain[blockchain.chain.length-1]);

const stats = {
  timeDiffs: [],
  get average() {
    return this.timeDiffs.reduce((total, num) => (total + num)) / this.timeDiffs.length;
  },
};

for (let i = 0; i < 10000; i++) {
  const prevBlock = blockchain.chain[blockchain.chain.length - 1];
  blockchain.addBlock({ data: `block${i}` });

  const newBlock = blockchain.chain[blockchain.chain.length - 1];
  const timeDiff = newBlock.timestamp - prevBlock.timestamp;

  stats.timeDiffs.push(timeDiff);
  console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${newBlock.difficulty}. Average time: ${stats.average}ms`);
}
///to test how it works in the terminal use command (node script/POW.js)

/**
 * This code snippet demonstrates the process of mining blocks and calculating the average time it takes to mine each block in a blockchain. The stats object is used to store time differences (timeDiffs) and calculate the average mining time (average).

timeDiffs: An empty array that will be used to store the time differences between the mining of consecutive blocks.
average: A getter method that calculates the average of the time differences in the timeDiffs array. It uses the reduce() method to sum all the time differences and then divides the sum by the number of elements in the timeDiffs array.
The for loop iterates 10,000 times to mine 10,000 blocks:

It starts by getting the last block in the blockchain (prevBlock) using blockchain.chain[blockchain.chain.length - 1].
It mines a new block by calling blockchain.addBlock() with the data set to block${i} (e.g., "block0", "block1", etc.).
It gets the newly added block (newBlock) using blockchain.chain[blockchain.chain.length - 1].
It calculates the time difference (timeDiff) between the mining of the new block and the previous block by subtracting the timestamp of the previous block from that of the new block.
It adds the calculated time difference to the timeDiffs array in the stats object using stats.timeDiffs.push(timeDiff).
It logs the mining time for the current block, the difficulty level of the new block, and the average mining time so far using console.log(). The average mining time is obtained using stats.average.
This code snippet helps to visualize the mining process and monitor how the mining difficulty and the average mining time evolve as more blocks are added to the blockchain.
 */