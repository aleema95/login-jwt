import { Request, Response, NextFunction } from 'express'
import { IGetUserAuthInfoRequest } from '../Types'
const { Router } = require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt');
const router = Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()

const posts = [
  {
    username: 'asdjaqi',
    title: "Post from asdjaqi"
  },
  {
    username: 'OtherGuy',
    title: "Post from OtherGuy"
  }
]

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

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

function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: Error, user: string) => {
    if(err) return res.sendStatus(403)
    
    req.username = user
    next()
  })
}

router.post('/login', AuthenticateUser, async (req: Request, res: Response) => {
  const { id } = req.body 

  try {
    const user = await User.findOne({ _id: id }, { password: false })

    const accessToken = jwt.sign(user.username, ACCESS_TOKEN_SECRET)
    
    res.send({user, accessToken})
  } catch (error) { 
    console.log(error);
    res.send(error)
  }
})

router.get('/userInfo', authenticateToken, async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { username } = req;

  const userPosts = posts.filter( post => post.username === username)
  const user = await User.findOne({ username }, { password: false })

  res.send({user, userPosts})
})

module.exports = router