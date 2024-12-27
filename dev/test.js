const BlockChain  = require('./blockChain');

const dummyCoin = new BlockChain();
dummyCoin.createNewBlock(1234, '0', 'HGBOUYGBUO');
dummyCoin.createNewBlock(1234, 'HGBOUYGBUO', 'HGBHUOOUYGBUO');

console.log(dummyCoin);