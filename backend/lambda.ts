import 'dotenv/config'
import { gql, ApolloServer } from "apollo-server-lambda";
import { connectToDatabase } from './repositories/mongodb';
import { ObjectId } from 'mongodb' 

import { User } from './types/User';
import { Post } from './types/Post';

const IS_LOCAL = !!process.env.IS_LOCAL;

interface InputUserCreate {
  user: User
}

interface InputUserUpdate {
  userId: string,
  user: User
}

const typeDefs = gql`
  scalar Date

  enum Gender {
    male
    female
    undisclosed
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    phone: String!
    gender: Gender
    birthDate: Date
  }

  input UserCreateInput {
    name: String!
    email: String!
    phone: String!
    gender: Gender
    birthDate: Date
  }

  input UserUpdateInput {
    name: String
    email: String
    phone: String
    gender: Gender
    birthDate: Date
  }

  type Post {
    _id: ID
    title: String
    text: String
    author: User
  }

  input AuthorInput {
    _id: ID!,
    name: String!
  }

  type Query {
    users: [User]
    user(name: String): User
    posts: [Post]
  }

  type Mutation {
    userCreate(user: UserCreateInput! ): User
    userUpdate(userId: ID!, user: UserUpdateInput! ): User
    post(title: String, text: String, author: AuthorInput!): Post
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const db = await connectToDatabase();

      const users = await db.collection("users").find({}).toArray();
      return users;
    },
    user: async (_: unknown, { name }: User) => {
      const db = await connectToDatabase();

      const user = await db.collection("users").findOne({name});
      return user;
    },
    posts: async () => {
      const db = await connectToDatabase();

      const posts = await db.collection("posts").find({}).toArray();
      return posts;
    },
  },

  Mutation: {
    userCreate: async (_: unknown, { user }: InputUserCreate): Promise<User> => {
      const db = await connectToDatabase();
      const _id = (await db.collection('users').insertOne({...user})).insertedId

      return { ...user, _id };
    },
    userUpdate: async (_: unknown, { userId, user }: InputUserUpdate ): Promise<User> => {
      const db = await connectToDatabase();
      const _id = new ObjectId(userId)

      await db.collection('users').updateOne({ _id }, { $set: user })
      const userFinded = (await db.collection("users").findOne({ _id })) as User
      return userFinded;
    },
    post: async (_: unknown, post: Post) => {
      const db = await connectToDatabase();
      const user = await db.collection("users").findOne({ _id: new ObjectId(post.author._id) })

      if (!user) throw new Error(`Author ${post.author.name || 'unknown'} (${post.author._id || 'without id'}) not found!`);
      await db.collection('posts').insertOne(post)
      return post;
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: IS_LOCAL,
  debug: true,
});

export const handler = server.createHandler()