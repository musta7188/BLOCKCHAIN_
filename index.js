const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const Blockchain = require('./Blockchain/blockchain');
const PubSub = require('./application/pubsub');
const request = require('request');
const TransactionPool = require('./Digital_wallet/transaction_pool');
const Wallet = require('./Digital_wallet/wallet');
const TransactionMiner = require('./application/transaction-miner');
// const { initMetaMask, getBalance } = require('./Digital_wallet/metmask');
// Initialize the application and its components
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// const htmlFile = "../blockchain-front-end/public/index.html"

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'client/dist')));
// app.use(express.static('../blockchain-front-end/public'))

// Get all blocks in the blockchain
const handleGetBlocks = (req, res) => res.json(blockchain.chain);

// Mine a new block with the provided data
const handleMine = (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastUpdatedBlockchain();
  res.redirect('/api/blocks');
};

// Create or update a transaction in the transaction pool
const handleMakeTransaction = (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.findExistingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.storeTransaction(transaction);
  pubsub.broadcastTransaction(transaction);
  res.json({ type: 'success', transaction });
};
// Get the current state of the transaction pool
const handleTransactionPoolMap = (req, res) => res.json(transactionPool.transactionMapping);

// Mine valid transactions from the transaction pool
const handleMineTransactions = (req, res) => {
  transactionMiner.mineTransactionToBlock();
  res.redirect('/api/blocks');
};

// Get wallet information, including public key and balance
const handleWalletInfo = (req, res) => {
  res.json({
    address: wallet.publicKey,
    balance: Wallet.balanceCalculation({ chain: blockchain.chain, address: wallet.publicKey }),
  });
};

const sendFileToClient = (req, res) =>{

  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
}


// Define API routes and their handlers
app.get('/api/blocks', handleGetBlocks);
app.post('/api/mine', handleMine);
app.post('/api/make-transaction', handleMakeTransaction);
app.get('/api/transaction-poolMap', handleTransactionPoolMap);
app.get('/api/mine-transactions', handleMineTransactions);
app.get('/api/info-wallet', handleWalletInfo);
app.get('*',sendFileToClient);///to start the application request


// Sync with the root node to maintain an up-to-date blockchain and transaction pool
const syncWithRootNode = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log('replace chain on sync with:', rootChain);
      blockchain.changeChain(rootChain);
    }
  });

    // Sync transaction pool map with root node
    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-poolMap` }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);
        console.log('replace transaction pool map on sync with', rootTransactionPoolMap);
        transactionPool.updateMapping(rootTransactionPoolMap);
      }
    });
  };
  
const walletTest1 = new Wallet();
const walletTest2 = new Wallet();

const walletTransactionGenerator = ({wallet, recipient, amount}) =>{
  const transaction = wallet.createTransaction({
    recipient, amount, chain: blockchain.chain
  });

  transactionPool.storeTransaction(transaction);
};

const walletOperation = () => walletTransactionGenerator({
  wallet, recipient: walletTest1.publicKey, amount:10
});

const walletTest1Operation = () => walletTransactionGenerator({
  wallet:walletTest1, recipient: walletTest2.publicKey, amount:20
});

const walletTest2Operation = () => walletTransactionGenerator({
  wallet: walletTest2, recipient: wallet.publicKey, amount:30
});


for (let i=0; i<10; i++){
  if(i%3 === 0){
    walletOperation();
    walletTest1Operation();
  } else if (i%3 ===1 ){
    walletOperation();
    walletTest2Operation();
  } else{
    walletTest1Operation();
    walletTest2Operation();
  }

  
  transactionMiner.mineTransactionToBlock()
};



let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;


const hardCodedWalletBalance = 500;
const hardCodedWalletAddress = "0x1234567890abcdef";

// ...

// app.listen(PORT, async () => {
//   console.log(`listening at localhost: ${PORT}`);
//   if (PORT !== DEFAULT_PORT) {
//     syncWithRootNode();
//   }

//   const accounts = await initMetaMask();
//   if (accounts) {
//     const metamaskWalletAddress = accounts[0];
//     const metamaskWalletBalance = await getBalance(metamaskWalletAddress);

//     console.log(`MetaMask Wallet Address: ${metamaskWalletAddress}`);
//     console.log(`MetaMask Wallet Balance: ${metamaskWalletBalance}`);
//   } else {
//     const walletAddress = hardCodedWalletAddress;
//     const walletBalance = hardCodedWalletBalance;

//     console.log(`Wallet Address: ${walletAddress}`);
//     console.log(`Wallet Balance: ${walletBalance}`);
//   }
// });


app.listen(PORT, () => {
  console.log(`listening at localhost: ${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncWithRootNode();
  }
});

