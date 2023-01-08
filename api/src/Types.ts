import { Request } from 'express'

export interface UserTypes {
  _id: string,
  name: string,
  username: string,
  password: string,
  email: string,
}

export interface IGetUserAuthInfoRequest extends Request {
  _id: string,
}

export interface usernameToken extends Request {
  _id: string
}