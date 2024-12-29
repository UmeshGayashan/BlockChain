const express = require('express');
const bodyParser = require('body-parser');
const BlockChain  = require('./blockChain');

const dummyCoin = new BlockChain();

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/blockchain', function (req, res) {
  res.send(dummyCoin);
})

app.post('/transaction', function (req, res) {
  const blockIndex = dummyCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
})

app.get('/mine', function (req, res) {
  const lastBlock = dummyCoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: dummyCoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  const nonce = dummyCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = dummyCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  const newBlock = dummyCoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: 'New block mined successfully',
    block: newBlock
  });
})

app.listen(3000, function () {
  console.log('listening on port 3000!')
});