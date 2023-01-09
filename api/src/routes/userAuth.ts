import { Request, Response } from 'express'
import { usernameToken } from '../Types'
import { AuthenticateUser, generateAccessToken, authenticateToken } from '../functions';
const { Router } = require('express');
const User = require('../models/User')
const router = Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()

// const posts = [
//   {
//     username: 'asdjaqi',
//     title: "Post from asdjaqi"
//   },
//   {
//     username: 'OtherGuy',
//     title: "Post from OtherGuy"
//   }
// ]

let refreshTokens: string[] = []

const { REFRESH_TOKEN_SECRET } = process.env

router.post('/login', AuthenticateUser, async (req: Request, res: Response) => {
  const { username } = req.body 

  try {
    const userInfo = await User.findOne({ username }, { password: false })
    
    const accessToken = generateAccessToken(userInfo._id) // probar mandando el userInfor entero
    const refreshToken = jwt.sign({_id: userInfo._id}, REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    
    res.send({userInfo, accessToken, refreshToken})
  } catch (error) { 
    console.log(error);
    res.send(error)
  }
})

router.get('/userInfo', authenticateToken, async (req: usernameToken, res: Response) => {
  const { _id } = req;

  const userFound = await User.findOne({ _id }, { password: false })

  res.send({userFound})
})

router.post('/token', (req: Request, res: Response) => {
  const refreshToken = req.body.token; 
  
  if(refreshToken == null) return res.sendStatus(401)
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: Error, user: any) => {
    if(err) return res.sendStatus(403)
    
    const accessToken = generateAccessToken(user._id)
    res.send({ accessToken })
  })
})

module.exports = router