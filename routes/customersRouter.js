import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all customers
router.get("/",async (request,response)=>{
    const customers = await client.db("inventoryBilling").collection("customers").find().toArray();
    response.send(customers);
})
 
//to get a customer
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const customer = await client.db("inventoryBilling").collection("customers").findOne({_id : ObjectId(id)})   
    response.send(customer);
})

//to insert customer to db
router.post("/",async(request,response)=>{
    const newCustomer = request.body;
    const result = await client.db("inventoryBilling").collection("customers").insertOne(newCustomer)
    response.send(result)
})

//to update a customer
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateCustomer = request.body;
    const result = await client.db("inventoryBilling").collection("customers").updateOne({ _id: ObjectId(id) }, { $set: updateCustomer })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(!result){
        response.send({message:"error"})
        return;
    }
    const updatedCustomer = await client.db("inventoryBilling").collection("customers").findOne({ _id: ObjectId(id)})
    response.send(updatedCustomer)
})

//delete a customer
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("customers").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const customersRouter = router;