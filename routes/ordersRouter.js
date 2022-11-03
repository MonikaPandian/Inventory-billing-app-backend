import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get orders count
router.get("/count",async (request,response)=>{
    const ordersCount = (await client.db("inventoryBilling").collection("orders").countDocuments()).toString();
    response.send(ordersCount);
})

//get all orders
router.get("/",async (request,response)=>{
    const orders = await client.db("inventoryBilling").collection("orders").find().toArray();
    response.send(orders);
})
 
//to get a order
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const order = await client.db("inventoryBilling").collection("orders").findOne({_id : ObjectId(id)})   
    response.send(order);
})

//to insert order to db
router.post("/",async(request,response)=>{
    const newOrder = request.body;
    const result = await client.db("inventoryBilling").collection("orders").insertOne(newOrder)
    response.send(result)
})

//to update a order
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateOrder = request.body;
    const result = await client.db("inventoryBilling").collection("orders").updateOne({ _id: ObjectId(id) }, { $set: updateOrder })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a order
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("orders").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const ordersRouter = router;