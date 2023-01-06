import { Request, Response, NextFunction } from 'express';
import { UserTypes } from '../Types';
const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = Router();

const saltRounds: number = 10;

router.get('/all', async (_req: Request, res:Response) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.send(error)
  }
})

// =============================================================

router.get('/', async (req: Request, res:Response) => {
  const { id }: { id: string} = req.body;

  try {
    const user = await User.findOne({ _id: id})

    res.send(user)
  } catch (error) {
    console.error(error);
    res.send(error)
  }
})

router.post('/create', async (req: Request, res: Response) => {
  const { name, username, password, email }: UserTypes = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds)
  
  try {
    const newUser = await User({
      name,
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.send('User created successfuly');
  } catch (error) {
    res.send({error})
  }
})

router.delete('/destroy', async (req: Request, res: Response) => {
  const { id }: { id: string} = req.body

  try {
    await User.deleteOne({ _id: id })
    
    res.send('User deleted successfuly')
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})

router.put('/update', async (req: Request, res: Response) => {
  const { id, name, email }: { id: string, name: string, email: string} = req.body;

  try {
    await User.findOneAndUpdate({ _id: id }, {name, email})
    
    res.send('User updated successfuly')
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})



module.exports = router;