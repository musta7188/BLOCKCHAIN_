const Web3 = require('web3');

const initMetaMask = async () => {
  if (typeof window.ethereum === 'undefined') {
    console.log('Please install MetaMask to use this dApp');
    return null;
  }
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts;
  } catch (error) {
    console.error('User denied account access');
    return null;
  }
};

const getBalance = async (address) => {
  try {
    const balanceInWei = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    const balanceInEther = parseFloat(window.ethereum.web3.utils.fromWei(balanceInWei, 'ether'));
    return balanceInEther;
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
};

module.exports = { initMetaMask, getBalance };



