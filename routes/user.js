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

    const isUserExist = await client.db("inventoryBilling").collection("users").findOne({ username: username })

    if (isUserExist) {
        response.status(400).send({ message: "Username already taken" })
        return;
    }   

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const result = await client.db("inventoryBilling").collection("users").insertOne({ username: username, firstName: firstName, lastName: lastName, password: hashedPassword });
    response.send(result)
})

//login 
router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    const userFromDB = await client.db("inventoryBilling").collection("users").findOne({ username: username })
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
    response.send({ message: "Successful login", token: token });
})

//forgot-password send-email
router.post("/forgot-password", async (request, response) => {
    const { username } = request.body;

    //Make sure user exists in database
    const userFromDB = await client.db("inventoryBilling").collection("users").findOne({ username: username })

    if (!userFromDB) {
        response.status(400).send({ message: "Enter a valid and registered email Id" })
        return;
    }
    //User exist and now create a one time link valid for 15 minutes
    const secret = process.env.SECRET_KEY + userFromDB.password;
    const payload = {
        email: userFromDB.username,
        id: userFromDB._id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '15m' })
    const link = `https://inventory-billing-app-751e91.netlify.app/reset-password/${userFromDB._id}/${token}`;

    var transporter = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'panmonikmm@gmail.com',
            pass: 'lxkugchepioxgtmr'
        }
    });

    var mailOptions = {
        from: 'panmonikmm@gmail.com',
        to: `${userFromDB.username}`,
        subject: 'Inventory billing Application Password reset link',
        html: `We have received your request for reset password. Click this link to reset your password.<br>
              <a href = ${link}>Click Here</a><br>
              <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent:' + info.response);
        }
    })

    response.send({ message: "success" });
})

//reset password
router.post("/reset-password", async (request, response) => {
    const { id, token, password } = request.body;

    //check if this id exist in database
    const employeeFromDB = await client.db("b37wd").collection("employees").findOne({ _id: ObjectId(id) })

    if (!employeeFromDB) {
        response.status(400).send({ message: "Enter a valid and registered email Id" })
        return;
    }

    const secret = process.env.SECRET_KEY + employeeFromDB.password;
    try {
        const payload = jwt.verify(token, secret)
        
        if (payload) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const updatePassword = await client.db("b37wd").collection("employees").updateOne({ _id: ObjectId(id) }, { $set: {password : hashedPassword} })
            response.send({ message: "Password successfully reset",password:updatePassword })
        }
        else{
            response.send({message : "Token Expired"})
        }
    }
    catch (error) {
        console.log(error.message)
        response.send(error.message)
    }
})

export const userRouter = router;