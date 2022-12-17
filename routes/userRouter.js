import express, { response } from "express";
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

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await client.db("inventoryBilling").collection("users").insertOne({ username: username, firstName: firstName, lastName: lastName, password: hashedPassword });
        response.send(result)
    } catch (error) {
        response.status(500).send("Internal server error");
    }
})

//login 
router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    const userFromDB = await client.db("inventoryBilling").collection("users").findOne({ username: username })
    if (!userFromDB) {
        response.status(400).send({ message: "Invalid credentials" })
        return;
    }

    try {
        const storedPassword = userFromDB.password;

        const isPasswordMatch = await bcrypt.compare(password, storedPassword)
        if (!isPasswordMatch) {
            response.status(400).send({ message: "Invalid credentials" });
            return;
        }
        //issue token
        const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
        response.send({ message: "Successful login", token: token, username: userFromDB.username, id: userFromDB._id, isAdmin: false, firstName: userFromDB.firstName, lastName: userFromDB.lastName });
    } catch (error) {
        response.status(500).send("Internal server error")
    }
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
    try {
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
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        var mailOptions = {
            from: 'panmonikmm@gmail.com',
            to: `${userFromDB.username}`,
            subject: 'Inventory billing Application Password reset link',
            html: `We have received your request for reset password. Click this link to reset your password.<br>
              <a style="font-size:20px" href = ${link}>Click Here</a><br>
              <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`
        };

        const message = await transporter.sendMail(mailOptions).then((response) => console.log(response)).catch((error) => console.log(error));
        response.send({ message: "success" });
    } catch (error) {
        response.status(500).send("Internal server error");
    }
})

//reset password
router.get("/reset-password/:id/:token", async (request, response) => {
    const { id, token } = request.params;
    //check if this id exist in database
    const userFromDB = await client.db("inventoryBilling").collection("users").findOne({ _id: ObjectId(id) })
    if (!userFromDB) {
        response.status(400).send({ message: "User not exists!!" })
        return;
    }
    const secret = process.env.SECRET_KEY + userFromDB.password;
    try {
        const verify = jwt.verify(token, secret)
        response.send("Verified")
    }
    catch (error) {
        response.send("Not Verified")
    }
}
)

router.post("/reset-password/:id/:token", async (request, response) => {
    const { id, token } = request.params;
    const { password } = request.body;

    //check if this id exist in database
    const userFromDB = await client.db("inventoryBilling").collection("users").findOne({ _id: ObjectId(id) })

    if (!userFromDB) {
        response.status(400).send({ message: "User not exists!!" })
        return;
    }
    const secret = process.env.SECRET_KEY + userFromDB.password;
    try {
        const verify = jwt.verify(token, secret)
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt)        
        const updatePassword = await client.db("inventoryBilling").collection("users").updateOne({ _id: ObjectId(id) }, { $set: { password: encryptedPassword } })
        response.send({ message: "Password updated successfully" })
    }
    catch (error) {
        response.send({ message: "Token expired" })
    }
})

export const userRouter = router;