import express from "express";
import { z } from "zod";
import cors from "cors";
import fs from "fs/promises";

const server = express();

server.use(cors());

server.use(express.json());

type User = { email: string; password: string; confirmPassword: string };

const readFile = async () => {
  try {
    const data = await fs.readFile(`${__dirname}/../database.json`, "utf-8");
    const users = JSON.parse(data);
    return users;
  } catch (error) {
    return null;
  }
};

server.post("/api/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    return res.status(400).send("Invalid email address");
  }

  if (password.length < 5) {
    return res.status(400).send("Password must be at least 5 characters long");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Password and confirmation do not match");
  }

  const existingUsers = await readFile();

  if (existingUsers.find((user: User) => user.email === email)) {
    return res.status(400).send("This email is already registered");
  }

  const newUser = { email };
  const updatedUsers = [...existingUsers, newUser];

  await fs.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(updatedUsers, null, 2)
  );

  res.send("Registration successfull");
});

server.listen(5001);
