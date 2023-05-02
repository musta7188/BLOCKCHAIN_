const { initMetaMask, getBalance } = require('../MetaMask');

// Mock window.ethereum object
global.window = {
  ethereum: {
    request: jest.fn(),
    web3: {
      utils: {
        fromWei: jest.fn(),
      },
    },
  },
};

describe('initMetaMask', () => {
  afterEach(() => {
    window.ethereum.request.mockClear();
  });

  test('should return accounts if MetaMask is installed and user grants access', async () => {
    const accounts = ['0x1234'];
    window.ethereum.request.mockResolvedValue(accounts);

    const result = await initMetaMask();
    expect(result).toEqual(accounts);
  });

  test('should return null if MetaMask is not installed', async () => {
    const originalEthereum = window.ethereum;
    window.ethereum = undefined;

    const result = await initMetaMask();
    expect(result).toBeNull();

    window.ethereum = originalEthereum;
  });

  test('should return null if user denies account access', async () => {
    window.ethereum.request.mockRejectedValue(new Error('User denied account access'));

    const result = await initMetaMask();
    expect(result).toBeNull();
  });
});

describe('getBalance', () => {
  afterEach(() => {
    window.ethereum.request.mockClear();
    window.ethereum.web3.utils.fromWei.mockClear();
  });

  test('should return balance in Ether if successful', async () => {
    const address = '0x1234';
    const balanceInWei = '1000000000000000000';
    const balanceInEther = 1;

    window.ethereum.request.mockResolvedValue(balanceInWei);
    window.ethereum.web3.utils.fromWei.mockReturnValue(balanceInEther);

    const result = await getBalance(address);
    expect(result).toEqual(balanceInEther);
  });

  test('should return null if error occurs while getting balance', async () => {
    const address = '0x1234';
    window.ethereum.request.mockRejectedValue(new Error('Error getting balance'));

    const result = await getBalance(address);
    expect(result).toBeNull();
  });
});
