import { Sequelize } from "sequelize-typescript"
import { User } from "../models/User.js";
import { Post } from "../models/imageboard/Post.js";
import { Board } from "../models/imageboard/Board.js";
import { Media } from "../models/Media.js";
import { ChatRoom } from "../models/chat/ChatRoom.js";
import { Message } from "../models/chat/Message.js";



//const conn = new Sequelize('postgres://postgres:1234@localhost:2222/journalav')
//conn.addModels(["../models/**"])

export class DatabaseConnection{
    private static connection=new Sequelize({
        dialect: "sqlite",
        storage:'bucketChan.sqlite',
    });
    private static connectionOpen:boolean=false;
    public static async getConnection():Promise<Sequelize>{
        if (!this.connectionOpen){
            this.connectionOpen=true
            console.log("env from connection",process.env.POSTGRES_USER)
            await this.connection.authenticate()
            this.connection.addModels([User,Board,Post,Media,ChatRoom,Message])
            await this.connection.sync()
            await this.connection.query("PRAGMA foreign_keys = ON");
            return this.connection
            /*}).catch((reason)=>{
                console.error(`Failed to open connection to database with "${reason}"`)
                this.connectionOpen=false
                return null
            })*/
        }
        else{
            return this.connection
        }
    }

}