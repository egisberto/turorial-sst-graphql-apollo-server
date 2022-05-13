import { ObjectId } from "mongodb"
import { User } from './User'

export type Post = {
  _id: ObjectId
  title: string
  text: string
  author: User
}