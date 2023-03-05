const express = require('express')
const bodyParser = require('body-parser')
 
const app = express()
 
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json())

app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/homepage.html')
})

app.post('/decrypt', (req, res) => {
  let data = req.body.data;
  console.log(data)
  res.end()
})