import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { userRouter } from './routes/userRouter.js';
import {customersRouter} from './routes/customersRouter.js'
import {stocksRouter} from './routes/stocksRouter.js'
import {suppliersRouter} from './routes/suppliersRouter.js'
import {productsRouter} from './routes/productsRouter.js'
import {cardsRouter} from './routes/cardsRouter.js'
import {billsRouter} from './routes/billsRouter.js'
import {adminRouter} from './routes/adminRouter.js'
import {invoicesRouter} from './routes/invoicesRouter.js'
import {ordersRouter} from './routes/ordersRouter.js'
import {notificationsRouter} from './routes/notificationsRouter.js'

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
    response.send("Hello Everyone. Welcome to the backend of Inventory billing application !! \n The API endpoints are /customers, /stocks, /suppliers, /products, /cards, /bills, /invoices, /orders, /notifications")
})

//specify movie router
app.use('/admin',adminRouter)
app.use('/users',userRouter)
app.use('/customers',customersRouter)
app.use('/stocks',stocksRouter)
app.use('/suppliers',suppliersRouter)
app.use('/products',productsRouter)
app.use('/cards',cardsRouter)
app.use('/bills',billsRouter)
app.use('/invoices',invoicesRouter)
app.use('/orders',ordersRouter)
app.use('/notifications',notificationsRouter)

//create a server
app.listen(PORT,()=>console.log("server started on port",PORT));