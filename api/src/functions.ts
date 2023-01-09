import { NextFunction, Request, Response } from "express"
import { IGetUserAuthInfoRequest } from "./Types"
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const bcrypt = require('bcrypt');

const { ACCESS_TOKEN_SECRET } = process.env

const fifteenMinutes: number = 60 * 15

export function generateAccessToken(_id: IGetUserAuthInfoRequest) {
  return jwt.sign({_id}, ACCESS_TOKEN_SECRET, { expiresIn: fifteenMinutes})
}

export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: Error, user: any) => {
    if(err) return res.sendStatus(403)
    
    req._id = user._id
    next()
  })
}

export const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username })
    if(user == null) return res.sendStatus(404);
    
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