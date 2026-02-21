const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const Signup = require('./models/signup.models.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//GET ALL USER
app.get('/', async (req, res) => {
    try {
        const user = await Signup.find();
        res.status(200).json({ user });
    } catch (error) {
        if(user.length === 0){
            res.status(404).json({ message: "User not found" });
        }

        res.status(500).json({ message: "Error reloading the page" });
    }
})

// GET ALL USERS FROM DATABASE.
app.get('/api/signup', async (req, res) => {
    try{
        const user = await Signup.find();

        if(user.length === 0){
            return res.status(404).json({ message: "No user found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

//GET USER BY ID FROM DATABASE.
app.get('/api/signup/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await Signup.findById(id);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

//POST A NEW USER TO DATABASE.
app.post('/api/signup', async (req, res) => {
    try {
        const {name, email, password, username, gender} = req.body;

        //Validate users input
        if(!name || !email || !password || !username || !gender){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        //CHECK FOR DUPLICATE USERNAME OR EMAIL
        const existingUser = await Signup.findOne({
            $or: [{ email }, { username }]
        });

        if(existingUser){
            return res.status(400).json({ message: "Email or username already exists" });
        }

        const newUser = new Signup({
            name,
            email, 
            password,
            username,
            gender
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        if(error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

//PUT (UPDATE) A USER IN DATABASE.
app.put('/api/signup/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, username, gender } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if(!name || !email || !password || !username || !gender){
            return res.status(400).json({ message: "All fields are required" });
        }

        const updateUser = await Signup.findByIdAndUpdate(
            id,
            { name, email, password, username, gender },
            { returnDocument: 'after', runValidators: true }
        );

        if(!updateUser){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updateUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

//PATCH (PARTIALLY UPDATE) A USER IN DATABASE.
app.patch('/api/signup/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const updateUser = await Signup.findByIdAndUpdate(
            id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        )

        if(!updateUser){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updateUser });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

//DELETE A USER FROM DATABASE.
app.delete('/api/signup/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const deleteUser = await Signup.findByIdAndDelete(id);

        if(!!deleteUser){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user: deleteUser });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

//Middleware to handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
