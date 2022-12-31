import { Request, Response, NextFunction } from 'express'
const { Router } = require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const router = Router();

const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ _id: id })

    await bcrypt.compare(password, user.password, function(err: Error, result: boolean) {
      // result == true
      if(err) return console.error(err);
      if(!result) return res.status(401).send('Authentication error, please check your credentials.')
      return next()
    }); 
  } catch (error) {
    console.error(error,'catch Auth error');
  }
}

router.post('/login', AuthenticateUser, async (req: Request, res: Response) => {
  const { id } = req.body

  try {
    const user = await User.findOne({ _id: id }, { password: false })
    
    res.send(user)
  } catch (error) { 
    console.log(error);
    res.send(error)
  }
})

module.exports = router