import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all cards
router.get("/",async (request,response)=>{
    const cards = await client.db("inventoryBilling").collection("cards").find().toArray();
    response.send(cards);
})
 
//to get a card
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const card = await client.db("inventoryBilling").collection("cards").findOne({_id : ObjectId(id)})   
    response.send(card);
})

//to insert card to db
router.post("/",async(request,response)=>{
    const newCard = request.body;
    const result = await client.db("inventoryBilling").collection("cards").insertOne(newCard)
    response.send(result)
})

//to update a card
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateCard = request.body;
    console.log(updateCard)
    const result = await client.db("inventoryBilling").collection("cards").updateOne({ _id: ObjectId(id) }, { $set: updateCard })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a card
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("cards").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const cardsRouter = router;