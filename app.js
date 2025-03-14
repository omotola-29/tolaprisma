const express = require("express");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome Tou Prisma, Express And PSQL Tutorial");
});

app.post("/createUser", async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }
        const user = await prisma.user.create({
            data: {
                email,
                password
            }
        })
        return res.status(201).json({message: "User created successfully", user});
    } catch (error) {
         return res.status(500).json({error: "Internal server error"});
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({error: "Internal server error"});
    }
})

// Update user

app.put("/updateUser/:id", async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    try {
        if (!email &&!password) {
            return res.status(400).json({ error: "Email or password are required" });
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                password
            }
        });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});