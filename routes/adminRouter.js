import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import NodeMailer from 'nodemailer';
import { ObjectId } from "mongodb";

const router = express.Router();

//signup - to insert data to db
router.post("/sign-up", async (request, response) => {
    const { username, firstName, lastName, password } = request.body;

    const isUserExist = await client.db("inventoryBilling").collection("admin").findOne({ username: username })

    if (isUserExist) {
        response.status(400).send({ message: "Username already taken" })
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const result = await client.db("inventoryBilling").collection("admin").insertOne({ username: username, firstName: firstName, lastName: lastName, password: hashedPassword, isAdmin: true });
    response.send(result)
})

//login 
router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    const userFromDB = await client.db("inventoryBilling").collection("admin").findOne({ username: username })
    if (!userFromDB) {
        response.status(400).send({ message: "Invalid credentials" })
        return;
    }

    const storedPassword = userFromDB.password;

    const isPasswordMatch = await bcrypt.compare(password, storedPassword)
    if (!isPasswordMatch) {
        response.status(400).send({ message: "Invalid credentials" });
        return;
    }
    //issue token
    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
    response.send({ message: "Successful login", token: token, username: userFromDB.username, id: userFromDB._id, isAdmin: true, firstName: userFromDB.firstName, lastName: userFromDB.lastName });
})

router.put("/profile/:id", async (request, response) => {
    const {id} = request.params;    
    const updateProfile = request.body;

    const isUserExist = await client.db("inventoryBilling").collection("admin").findOne({ _id: ObjectId(id) })
   
    if (!isUserExist) {
        response.status(400).send({ message: "Invalid credentials" })
        return;
    }
    const result = await client.db("inventoryBilling").collection("admin").updateOne({ _id: ObjectId(id) }, { $set: updateProfile });
    response.send(result)
})

router.post("/profile", async (request, response) => {
    const {username} = request.body;    
  
    const result = await client.db("inventoryBilling").collection("admin").findOne({ username: username})
   
    if (!result) {
        response.status(400).send({ message: "Invalid credentials" })
        return;
    }      
    response.send(result)
})

export const adminRouter = router;