import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all bills
router.get("/",async (request,response)=>{
    const bills = await client.db("inventoryBilling").collection("bills").find().toArray();
    response.send(bills);
})
 
//to get a bill
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const bill = await client.db("inventoryBilling").collection("bills").findOne({_id : ObjectId(id)})   
    response.send(bill);
})

//to insert bill to db
router.post("/",async(request,response)=>{
    const newBill = request.body;
    const result = await client.db("inventoryBilling").collection("bills").insertOne(newBill)
    response.send(result)
})

//to update a bill
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateBill = request.body;
    const result = await client.db("inventoryBilling").collection("bills").updateOne({ _id: ObjectId(id) }, { $set: updateBill })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a bill
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("bills").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const billsRouter = router;