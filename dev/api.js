const express = require('express');
const bodyParser = require('body-parser');
const BlockChain  = require('./blockChain');
const { v1: uuidv1 } = require('uuid');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuidv1().split('-').join('');

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
  const newTransaction = req.body;
  const blockIndex = dummyCoin.addTransactionToPendingTransaction(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
})

app.post('/transaction/broadcast', function(req,res){
  const newTransaction = dummyCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  dummyCoin.addTransactionToPendingTransaction(newTransaction);

  const requestPromises = [];
  dummyCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      res.json({ note: 'Transaction created and broadcast successfully.' });
    });
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

  const requestPromises = [];
  dummyCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock },
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });
 
  Promise.all(requestPromises)
  .then(data => { 
    const requestOptions = {
      uri: dummyCoin.currentNodeUrl + 'transaction/broadcast',
      method: 'POST',
      body: {
        amount: 12.5,
        sender: '00',
        recipient: nodeAddress
      },
      json: true
    };

    return rp(requestOptions);
  })
  .then(data => {
    res.json({
      note: 'New block mined & broadcast successfully',
      block: newBlock
    });
  });
})

// Register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (dummyCoin.networkNodes.indexOf(newNodeUrl) === -1) dummyCoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  dummyCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };

    regNodesPromises.push(rp(requestOptions)); // Push the request to the array
  });

  Promise.all(regNodesPromises) // Wait for all requests to complete
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [...dummyCoin.networkNodes, dummyCoin.currentNodeUrl] },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: 'New node registered with network successfully.' });
    });

})

// Register a node with the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = dummyCoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = dummyCoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) dummyCoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.' });
})

// Register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = dummyCoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = dummyCoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) dummyCoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: 'Bulk registration successful.' });
})

app.listen(port, function () {
  console.log(`listening on port ${port}!`)
});