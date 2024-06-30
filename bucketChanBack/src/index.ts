import express, { json } from "express";
import { createServer } from "http";
import { DatabaseConnection } from "./chan/repository/database.js";
import { boardRouter } from "./chan/controllers/boardController.js";

const port=3000;

const app=express()
const server=createServer(app)

app.use(json())

export const dbConnection=await DatabaseConnection.getConnection()

app.use("/board",boardRouter);

app.get("/hello",(req,res)=>{
    res.send("hell");
})

server.listen(port,"0.0.0.0",()=>{
    console.log("up and running")
})