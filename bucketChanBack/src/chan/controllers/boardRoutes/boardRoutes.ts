import Joi from "joi";
import { Board } from "../../models/imageboard/Board.js";
import { ChatRoom } from "../../models/chat/ChatRoom.js";
import { User } from "../../models/User.js";
import { DataType, Sequelize } from "sequelize-typescript";
import multer from "multer"
import path from "path";
import { Post } from "../../models/imageboard/Post.js";
import { dbConnection } from "../../repository/database.js";
import { createHash } from "crypto";
import { mkdirSync, openSync, readFileSync, renameSync } from "fs";
import { Media } from "../../models/Media.js";


const imageStoragePath=path.join("uploaded","multimedia");
var imageStorage=multer.diskStorage({
    destination: imageStoragePath,
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

export var postImagesUpload=multer({
    storage: imageStorage,
    limits:{
        fileSize: 20 * 1024 * 1024
    },
    fileFilter:function(req,file,cb){
        checkFileTypeForImage(req,file,cb)
        
    }
}).array("mediaFiles")

function checkFileTypeForImage(req,file,cb){
    let filetypes=/jpeg|jpg|png|gif|mp4|webm/
    let extensionType=filetypes.test(path.extname(file.originalname));
    let mimetype=filetypes.test(file.mimetype);
    if (mimetype&&extensionType){
        try{
            if (req.body && req.body.newThread){
                let thread=req.body.newThread
                let media:any[]=thread.media;
                let checkedMedia=media.filter(media=>media.filename==file.originalname)[0]
                checkedMedia.mimeType=mimetype
            }
        }
        catch(error){
            console.log(error)
            return cb(error,false);
        }
        return cb(null,true)
    }
    else{
        cb("file format no supported")
    }
}

export var boardCreationValidator = Joi.object({
    shortName: Joi.string().max(6).required(),
    name: Joi.string().max(100).required(),
    creatorId: Joi.number().min(1)
})

export var postMediaValidator=Joi.object({
    filename: Joi.string().required(),
    mimeType: Joi.string().required()
})

export var threadCreationValidator=Joi.object({
    boardShortName: Joi.number().min(1).required(),
    title: Joi.string(),
    body: Joi.string().required(),
    media: Joi.array().min(0).items(postMediaValidator).required(),
    authorId: Joi.number().min(1)
})

export var responsePostValidator=Joi.object({
    boardShortName: Joi.number().min(1).required(),
    title: Joi.string(),
    body: Joi.string().required(),
    media: Joi.array().min(0).items(postMediaValidator).required(),
    authorId: Joi.number().min(1),
})

export var responseCreationValidator=Joi.object({
    post: responsePostValidator,
    sage: Joi.string()
})

export async function setupBoard(creatorUserId,shortName,name,isR9k=false):Promise<{ok:boolean,savedBoard:any,error:any}>{
    let transaction=await dbConnection.transaction();
    try {
        let creator = await User.findByPk(creatorUserId);
        let creatorId=creator?creator.id:null
        let board = new Board({
            shortName,
            name,
            creatorId,
            isR9k
        })
        let savedBoard = await board.save({ transaction })
        let chatRoom = new ChatRoom({
            shortName,
            name,
            boardId: savedBoard.id
        })
        await chatRoom.save({ transaction })
        await transaction.commit();
        return {ok:true,savedBoard,error:null}
    }
    catch(error){
        await transaction.rollback()
        console.error(error)
        return {ok:false,savedBoard:null,error:error}
    }
}

export async function createThread(postJson,boardId):Promise<{ok:boolean,savedPost:any,error:any}>{
    try{
        let newPost=new Post({
            ...postJson,
            boardId
        });
        let savedPost=await newPost.save();
        await saveMedia(newPost,savedPost.id);
        return {ok:true,savedPost,error:null}
    }
    catch(error){
        return {ok:false,savedPost:null,error};
    }
}

export async function createResponse(postJson,thread:Post,sage:boolean):Promise<{ok:boolean,savedPost:any,error:any}>{
    try{
        let newPost=new Post({
            ...postJson,
            boardId: thread.boardId,
            threadId: thread.id
        });
        let savedPost=await newPost.save();
        await saveMedia(newPost,savedPost.id);
        if (thread.active && thread.responses.length+1<=150 && !sage){
            thread.bump()
            await thread.save()
        }
        else if (thread.active && thread.responses.length+1>150){
            thread.active=false;
            await thread.save();
        }
        return {ok:true,savedPost,error:null}
    }
    catch(error){
        return {ok:false,savedPost:null,error};
    }
}

async function saveMedia(post:Post,postId:number){
    for (let index = 0; index < post.media.length; index++) {
        const mediaFile = post.media[index]; 
        let hasher=createHash('sha256');
        let filePath=path.join(imageStoragePath,mediaFile.filename);
        let bytes=readFileSync(filePath);
        let imgHash=hasher.update(bytes).digest('hex');
        try{
            mediaFile.hash=imgHash;
            mkdirSync(path.join(imageStoragePath,`${imgHash}`))
            let newPath=path.join(imageStoragePath,`${imgHash}`,mediaFile.filename);
            renameSync(filePath,newPath);
            let fileToSave=new Media({
                ...mediaFile,
                postId
            });
            await fileToSave.save();  
        }
        catch(error){
            console.log(error)
        }
        
    }
}

