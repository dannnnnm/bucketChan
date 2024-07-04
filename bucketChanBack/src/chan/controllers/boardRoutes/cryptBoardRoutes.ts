import Joi from "joi";
import multer from "multer";
import path from "path";
import { Post } from "../../models/imageboard/Post.js";

export const cryptStorePath=path.join("uploaded","crypt");
const ageFileStorage=multer.diskStorage({
    destination: cryptStorePath,
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

export var postAgeUpload=multer({
    storage: ageFileStorage,
    limits:{
        fileSize: 20 * 1024 * 1024
    },
    fileFilter:function(req,file,cb){
        checkFileTypeForAge(req,file,cb)
        
    }
}).single("ageFile")

function checkFileTypeForAge(req,file,cb){
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


export var encryptedResponseCreationValidator=Joi.object({
    authorId:Joi.number().min(0).required(),
    fileHash: Joi.string().required(),
    filename: Joi.string().required(),
})

export async function createEncryptedResponse(json,thread:Post,sage:boolean):Promise<{ok:boolean,savedPost:any,error:any}>{
    try{
        let newPost=new Post({
            authorId:json.authorId,
            encryptedMessage: json.filename,
            encrypted:true,
            boardId: thread.boardId,
            threadId: thread.id
        });
        let savedPost=await newPost.save();
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