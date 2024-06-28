import express from "express";
import { createServer } from "http";

const port=3000;

const app=express()
const server=createServer(app)

app.get("/hello",(req,res)=>{
    res.send("hell");
})

server.listen(port,"0.0.0.0",()=>{
    console.log("up and running")
})