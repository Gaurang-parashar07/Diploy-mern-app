const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');


require('dotenv').config();

require('./Models/db');


const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!')

}) 
app.use(express.json());
app.use(bodyParser.json()); 

app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter); 


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})