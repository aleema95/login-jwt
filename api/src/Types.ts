import { Request } from 'express'

export interface UserTypes {
  _id: string,
  name: string,
  username: string,
  password: string,
  email: string,
}

export interface IGetUserAuthInfoRequest extends Request {
  username: string
}