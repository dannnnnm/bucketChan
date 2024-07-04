import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import { boardCreationValidator, createResponse, createThread as createThread, postImagesUpload, responseCreationValidator, setupBoard, threadCreationValidator } from "./boardRoutes/boardRoutes.js";
import { Board } from "../models/imageboard/Board.js";
import { User } from "../models/User.js";
import { ChatRoom } from "../models/chat/ChatRoom.js";
import { error } from "console";
import { Post } from "../models/imageboard/Post.js";
import { Media } from "../models/Media.js";
import { where } from "sequelize";
import { r9kAllow } from "../r9k/r9kChecker.js";
import { createEncryptedResponse } from "./boardRoutes/cryptBoardRoutes.js";


export const boardRouter=Router()

boardRouter.get("/boards",async (req,res)=>{
    let boards=await Board.findAll({order:['createdAt','DESC']});
    return res.send(boards);

})

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
    let boardShortName=req.params.shortName;
    let board=await Board.findOne({where:{shortName:boardShortName}});
    if (!board) return res.status(404).send({error:"board not found"});
    let postJson=JSON.parse(req.body.newThread);
    let result=await createThread(postJson,board.id)
    if (result.ok){
        return res.send(result.savedPost);
    }
    else{
        return res.status(400).send(result.error);
    }
})

boardRouter.post("/:shortName/:threadId/answer",postImagesUpload,validate(responseCreationValidator),async (req,res)=>{
    let postId=parseInt(req.params.threadId);
    let shortName=req.params.shortName;

    let responseJson=req.body.post;
    if (!shortName) return res.status(400).send("bad short name");
    if (Number.isNaN(postId)) return res.status(400).send("bad post id");

    let board=await Board.findOne({where:{shortName}})
    if (!board) return res.status(404).send("board not found");
    let thread=await Post.findOne({where:{id:postId,threadId:null,boardId:board.id}});
    if (!thread) return res.status(404).send("thread not found");
    if (!thread.active) return res.status(403).send("cannot interact with deleted thread");
    if (board.isR9k && !r9kAllow(board.threads,responseJson)) return res.status(406).send("repeated post in r9k-style board!")
    let result=await createResponse(responseJson,thread,req.body.sage);

    if (result.ok){
        return res.send(result.savedPost);
    }
    else{
        return res.status(400).send(result.error);
    }

})

boardRouter.post("/:shortName/:threadId/encryptedAnswer", async (req,res)=>{
    let postId=parseInt(req.params.threadId);
    let shortName=req.params.shortName;

    let responseJson=req.body.post;
    if (!shortName) return res.status(400).send("bad short name");
    if (Number.isNaN(postId)) return res.status(400).send("bad post id");

    let board=await Board.findOne({where:{shortName},include:{model: Post, include: [Media]}})
    if (!board) return res.status(404).send("board not found");
    let thread=await Post.findOne({where:{id:postId,threadId:null,boardId:board.id}});
    if (!thread) return res.status(404).send("thread not found");
    if (!thread.active) return res.status(403).send("cannot interact with deleted thread");
    if (board.isR9k && !r9kAllow(board.threads,responseJson)) return res.status(406).send("repeated post in r9k-style board!")
    let result=await createEncryptedResponse(responseJson,thread,req.body.sage);

    if (result.ok){
        return res.send(result.savedPost);
    }
    else{
        return res.status(400).send(result.error);
    }
})
