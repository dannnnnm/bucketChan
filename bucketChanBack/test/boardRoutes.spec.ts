
import { describe, it } from "node:test";
import { User } from "../src/chan/models/User.js";
import { Board } from "../src/chan/models/imageboard/Board.js";
import { Post } from "../src/chan/models/imageboard/Post.js";
import { Media } from "../src/chan/models/Media.js";
import { ChatRoom } from "../src/chan/models/chat/ChatRoom.js";
import { Message } from "../src/chan/models/chat/Message.js";
import { Sequelize } from "sequelize-typescript";
import { createThread, setupBoard } from "../src/chan/controllers/boardRoutes/boardRoutes.js";
import {expect,assert} from "chai"
import { faker } from '@faker-js/faker';



var testConnection=new Sequelize({
    dialect:"sqlite",
    storage:"test.sqlite",
    repositoryMode:true,
});
await testConnection.authenticate();
testConnection.addModels([User,Board,Post,Media,ChatRoom,Message])
await testConnection.sync({force:true})
await testConnection.query("PRAGMA foreign_keys = ON");
var boardRepository=await testConnection.getRepository(Board)
var postRepository=await testConnection.getRepository(Post)
var mediaRepository=await testConnection.getRepository(Media);
describe('Test /newBoard',()=>{
    it("new 'admin' board should be created",async ()=>{
        let result=await boardRepository.create({shortName:"k",name:"militarie"})
        console.log(result);
        assert.notEqual(result,null)
    })
})
describe('Test /board/newThread',()=>{
    it("thread should be created in board and with appropiate data",async ()=>{
        let board=await boardRepository.findOne({where:{shortName:"k"}});
        let postJson={
            title:faker.science.chemicalElement().name,
            body:faker.hacker.phrase(),
            media:[{filename:"a.png",hash:"wetjoiwertjwo",mimeType:"type/png"}]
        }
        let result=await postRepository.create({...postJson,boardId:board.id},{include:mediaRepository});
        console.log(`saved post json ${JSON.stringify(result)}`)
        assert.notEqual(result,null)
    })
})


describe('Test /board/response',()=>{
    it("response should be created in board and with appropiate data",async ()=>{
        let thread=await postRepository.findOne({where:{threadId:null}});
        let postJson={
            title:faker.science.chemicalElement().name,
            body:faker.hacker.phrase(),
            media:[],
            threadId:thread.id
        }
        let result=await postRepository.create({...postJson,boardId:thread.boardId});
        
        let recoveredPost=await postRepository.findOne({where:{threadId:null},include:[
            postRepository,
        ]});
        console.log(`saved post json ${JSON.stringify(recoveredPost)}`)
        assert.isTrue(recoveredPost.responses.length!=0)
    })
})


describe('Test bumping active',()=>{
    it("thread should be created in board and with appropiate data",async ()=>{
        let thread=await postRepository.findOne({where:{threadId:null}});
        let oldDate=thread.bumpedAt;
        let sleep=new Promise<number>((resolve,reject)=>{
            setTimeout(()=>{
                resolve(1)
            },2000)
        });
        await sleep;
        thread.bump()
        await thread.save()
        let newThread=await postRepository.findOne({where:{threadId:null}});
        assert.notDeepEqual(oldDate,newThread.bumpedAt);
    })
})