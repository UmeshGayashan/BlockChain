const express = require('express');
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/blockchain', function (req, res) {

})

app.post('/transaction', function (req, res) {

})

app.get('/mine', function (req, res) {

})

app.listen(3000, function () {
  console.log('listening on port 3000!')
});