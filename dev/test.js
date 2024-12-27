const BlockChain  = require('./blockChain');

const dummyCoin = new BlockChain();
dummyCoin.createNewBlock(1234, '0', 'HGBOUYGBUO');
dummyCoin.createNewTransaction(100, 'ALEXHJG', 'JENNYHJG');
dummyCoin.createNewBlock(124, 'HGBOUYGBUO', 'HGBOUYGBUOHIIG');

console.log(dummyCoin);
console.log(dummyCoin.chain[1]);