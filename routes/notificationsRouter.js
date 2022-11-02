import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all notifications
router.get("/",async (request,response)=>{
    const notifications = await client.db("inventoryBilling").collection("notifications").find().toArray();
    response.send(notifications);
})
 
//to get a notification
router.get("/:id",async (request,response)=>{
    const {id} = request.params;
    const notification = await client.db("inventoryBilling").collection("notifications").findOne({_id : ObjectId(id)})   
    response.send(notification);
})

//to insert notification to db
router.post("/",async(request,response)=>{
    const newNotification = request.body;
    const result = await client.db("inventoryBilling").collection("notifications").insertOne(newNotification)
    response.send(result)
})

//to update a notification
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateNotification = request.body;
    const result = await client.db("inventoryBilling").collection("notifications").updateOne({ _id: ObjectId(id) }, { $set: updateNotification })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    if(!result){
        response.send({message:"error"})
        return;
    }
    response.send(result)
})

//delete a notification
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("inventoryBilling").collection("notifications").deleteOne({_id: ObjectId(id)})
    response.send(result)
})

export const notificationsRouter = router;