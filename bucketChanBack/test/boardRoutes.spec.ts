
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
            media:[]
        }
        let result=await postRepository.create({...postJson,boardId:board.id});
        assert.notEqual(result,null)
    })
})