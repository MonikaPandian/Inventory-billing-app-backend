import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all stocks
router.get("/",async (request,response)=>{
    const stocks = await client.db("inventoryBilling").collection("stocks").find().toArray();
    response.send(stocks);
})
 
//to get a stock
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const customer = await client.db("inventoryBilling").collection("stocks").findOne({_id : ObjectId(id)})   
    response.send(customer);
})

//to insert a stock to db
router.post("/",async(request,response)=>{
    const newStock = request.body;
    const result = await client.db("inventoryBilling").collection("stocks").insertOne(newStock)
    response.send(result)
})

//to update a stock
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateStock = request.body;
    const result = await client.db("inventoryBilling").collection("stocks").updateOne({ _id: ObjectId(id) }, { $set: updateStock })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a stock
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("stocks").deleteOne({_id: ObjectId(id)})   
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send({message:"success"})    
})

export const stocksRouter = router;