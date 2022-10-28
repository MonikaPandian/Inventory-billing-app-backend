import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all suppliers
router.get("/",async (request,response)=>{
    const suppliers = await client.db("inventoryBilling").collection("suppliers").find().toArray();
    response.send(suppliers);
})
 
//to get a supplier
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const supplier = await client.db("inventoryBilling").collection("suppliers").findOne({_id : ObjectId(id)})   
    response.send(supplier);
})

//to insert supplier to db
router.post("/",async(request,response)=>{
    const newSupplier = request.body;
    const result = await client.db("inventoryBilling").collection("suppliers").insertOne(newSupplier)
    response.send(result)
})

//to update a supplier
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateSupplier = request.body;
    const result = await client.db("inventoryBilling").collection("suppliers").updateOne({ _id: ObjectId(id) }, { $set: updateSupplier })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a supplier
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("suppliers").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const suppliersRouter = router;