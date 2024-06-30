import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import { boardCreationValidator, createThread as createThread, postImagesUpload, setupBoard, threadCreationValidator } from "./boardRoutes/boardRoutes.js";
import { Board } from "../models/imageboard/Board.js";
import { User } from "../models/User.js";
import { ChatRoom } from "../models/chat/ChatRoom.js";
import { error } from "console";
import { Post } from "../models/imageboard/Post.js";
import { Media } from "../models/Media.js";


export const boardRouter=Router()

boardRouter.post("/new",validate(boardCreationValidator),async (req,res)=>{
    let json=req.body;
    let shortName=json.shortName
    let name=json.name
    let creatorId=json.creatorId;
    let existingBoard=await Board.findOne({where:{shortName}})
    if (existingBoard){
        return res.status(403).send({error:"board abbreviation already exists"})
    }
    let result=await setupBoard(creatorId,shortName,name)
    if (result.ok){
        return res.send(result.savedBoard);
    }
    else{
        return res.status(400).send(result.error);
    }

})

boardRouter.get("/:shortName",async (req,res)=>{
    let requestedShortName=req.params.shortName;
    if (!requestedShortName) return res.status(404).send({error:"No board letter requested"});
    let foundBoard = await Board.findOne({
        where: { shortName: requestedShortName },
        include: [
            { model: ChatRoom },
            { model: Post, include: [Media] }]
    });

    return res.send(foundBoard);
})


boardRouter.post("/:shortName/newThread",postImagesUpload,validate(threadCreationValidator,"newThread"),async (req,res)=>{
    let boardShortName=req.params.boardShortName;
    let board=await Board.findOne({where:{shortName:boardShortName}});
    if (!board) return res.status(404).send({error:"board not found"});
    let postJson=req.body;
    let result=await createThread(postJson,board.id)
    
})