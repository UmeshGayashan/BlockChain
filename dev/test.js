const BlockChain  = require('./blockChain');

const dummyCoin = new BlockChain();
// dummyCoin.createNewBlock(1234, '0', 'HGBOUYGBUO');
// dummyCoin.createNewTransaction(100, 'ALEXHJG', 'JENNYHJG');
// dummyCoin.createNewBlock(124, 'HGBOUYGBUO', 'HGBOUYGBUOHIIG');

const previousBlockHash = 'HGBOUYGBUO';
const currentBlockData = [
    {
        amount: 10,
        sender: 'ALEXHJG',
        recipient: 'JENNYHJG'
    },
    {
        amount: 30,
        sender: 'JENNYHJG',
        recipient: 'ALEXHJG'
    },
    {
        amount: 200,
        sender: 'ALEXHJG',
        recipient: 'JENNYHJG'
    }
];

const nonce = dummyCoin.proofOfWork(previousBlockHash, currentBlockData);
const hash = dummyCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log(`Hash: ${hash} and nonce: ${nonce}`);


console.log(dummyCoin);
console.log(dummyCoin.chain[1]);