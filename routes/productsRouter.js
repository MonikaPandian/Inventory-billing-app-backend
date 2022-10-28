import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all products
router.get("/",async (request,response)=>{
    const products = await client.db("inventoryBilling").collection("products").find().toArray();
    response.send(products);
})
 
//to get a product
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const product = await client.db("inventoryBilling").collection("products").findOne({_id : ObjectId(id)})   
    response.send(product);
})

//to insert a product to db
router.post("/",async(request,response)=>{
    const newProduct = request.body;
    const result = await client.db("inventoryBilling").collection("products").insertOne(newProduct)
    response.send(result)
})

//to update a product
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateProduct = request.body;
    const result = await client.db("inventoryBilling").collection("products").updateOne({ _id: ObjectId(id) }, { $set: updateProduct })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a product
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("products").deleteOne({_id: ObjectId(id)})   
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send({message:"success"})    
})

export const productsRouter = router;