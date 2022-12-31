import express, { Application, Request, Response, } from 'express'
import { UserTypes } from './Types'
const routes = require('./routes/index');
const mongoose = require("mongoose")
const User = require('./models/User')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config()

const app: Application = express();
const saltRounds: number = 10;
 
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

app.post('/user', async (req: Request, res: Response) => {
  const { name, username, password }: UserTypes = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds)
  
  try {
    const newUser = await User({
      name,
      username,
      password: hashedPassword
    });

    await newUser.save();

    console.log(newUser);
    

    res.send('User created successfuly');
  } catch (error) {
    res.send({error})
  }
})

app.delete('/user', async (req: Request, res: Response) => {
  const { id }: { id: string} = req.body

  try {
    await User.deleteOne({ _id: id })
    
    res.send('User deleted successfuly')
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
})