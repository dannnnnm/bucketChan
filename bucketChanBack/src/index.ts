import express, { json } from "express";
import { createServer } from "http";
import { boardRouter } from "./chan/controllers/boardController.js";
import cors from "cors"
import { initSocket } from "./chat/chatMaster.js";

const port=3000;

const app=express()
const server=createServer(app)
app.set('trust proxy', true)

app.use(cors())

app.use(json())


app.use("/board",boardRouter);

app.get("/hello",(req,res)=>{
    res.send("hell");
})

initSocket(server);

server.listen(port,"0.0.0.0",()=>{
    console.log("up and running")
})