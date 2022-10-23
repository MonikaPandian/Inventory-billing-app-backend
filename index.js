import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { userRouter } from './routes/user.js';

dotenv.config()

const app= express();
app.use(cors())
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
  const client = new MongoClient(MONGO_URL)
  await client.connect();
  console.log("Mongo is connected")
  return client;
}

export const client = await createConnection();

app.use(express.json())

app.get("/",(request,response)=>{
    response.send("Hello Everyone good")
})

//specify movie router
app.use('/users',userRouter)

//create a server
app.listen(PORT,()=>console.log("server started on port",PORT));