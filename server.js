const express = require('express');
const mongoose = require('mongoose');
const Signup = require('./models/signup.models.js');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());

//GET ALL USERS
app.get('/api/signup', async (req, res) => {
    try {
        const user = await Signup.find();

        if(user.length === 0){
            return res.status(404).json({ message: "user name should contain some value" });
        }

        return res.status(200).json({ message: "User data found", user });
    } catch (error) {
        return res.status(500).json({ message: "No user found" });
    }
});

//POST
app.post('/api/signup', async (req, res) => {
    try {
        const {name, email, username, password} = req.body;
        //ALL FIELDS REQUIRED
        if(!name || !email || !username || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        //PASSWORD LENGTH LESS THAN 6
        if(password.length < 6){
            return res.status(400).json({ message: "Password length should be greater than 6" });
        }

        const newUser = new Signup({
            name, 
            email,
            username,
            password
        });

        await newUser.save();
        res.status(201).json({ message: "new user created", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Cannot post a user", error: error.message });
    }
});

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })

    .catch((error) => {
        console.error("error connecting to mongoDB: ", error);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});