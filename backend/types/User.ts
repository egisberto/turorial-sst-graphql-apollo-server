import { ObjectId } from "mongodb"

export enum Gender {
  male = 'male',
  female = 'female',
  undisclosed = 'undisclosed'
}
export interface User {
  _id: ObjectId
  name: string
  email: string
  phone: string
  gender?: Gender
  birthDate?: Date
}