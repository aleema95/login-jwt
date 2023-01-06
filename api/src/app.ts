import express, { Application, Request, Response, } from 'express'
import { UserTypes } from './Types'
const routes = require('./routes/index');
const mongoose = require("mongoose")
const User = require('./models/User')
const bodyParser = require('body-parser');

require('dotenv').config()

const app: Application = express();
 
mongoose
  .connect('mongodb://localhost:27017/testProject')
  .then(() => {
    console.log('MongoDb Connected successfuly');
  })
  .catch((err: any) => {
    console.log(err);
  })


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json())

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const PORT = process.env.PORT || 3004

app.use('/', routes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
})