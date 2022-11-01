import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all invoices
router.get("/",async (request,response)=>{
    const invoices = await client.db("inventoryBilling").collection("invoices").find().toArray();
    response.send(invoices);
})
 
//to get a invoice
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const invoice = await client.db("inventoryBilling").collection("invoices").findOne({_id : ObjectId(id)})   
    response.send(invoice);
})

//to insert invoice to db
router.post("/",async(request,response)=>{
    const newInvoice = request.body;
    const result = await client.db("inventoryBilling").collection("invoices").insertOne(newInvoice)
    response.send(result)
})

//to update a invoice
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateInvoice = request.body;
    const result = await client.db("inventoryBilling").collection("invoices").updateOne({ _id: ObjectId(id) }, { $set: updateInvoice })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a invoice
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("invoices").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const invoicesRouter = router;