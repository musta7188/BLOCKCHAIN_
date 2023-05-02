const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  const dataA = 'Sample data A';
  const dataB = 'Sample data B';
  const dataC = 'Sample data C';

  it('creates a SHA-256 hashed output', () => {
    expect(cryptoHash(dataA)).toEqual(expect.any(String));
  });

  it('generates identical hash with same input arguments regardless of order', () => {
    expect(cryptoHash(dataA, dataB, dataC)).toEqual(cryptoHash(dataC, dataA, dataB));
  });
  it('yields distinct hash when properties change on an input', () => {
    const originalData = JSON.parse(JSON.stringify(dataA));
    const modifiedDataA = { ...originalData, newProp: 'new property' };
  
    expect(cryptoHash(originalData, dataB)).not.toEqual(cryptoHash(modifiedDataA, dataB));
  });
  
  it('creates unique hash with differing input data', () => {
    expect(cryptoHash(dataA, dataB)).not.toEqual(cryptoHash(dataA, dataC));
  });
});
