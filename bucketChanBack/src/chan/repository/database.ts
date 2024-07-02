import { Sequelize } from "sequelize-typescript"
import { User } from "../models/User.js";
import { Post } from "../models/imageboard/Post.js";
import { Board } from "../models/imageboard/Board.js";
import { Media } from "../models/Media.js";
import { ChatRoom } from "../models/chat/ChatRoom.js";
import { Message } from "../models/chat/Message.js";
import { setupBoard } from "../controllers/boardRoutes/boardRoutes.js";



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

async function setupBasicBoards(){
    console.log("setting up basic boards")
    await setupBoard(null,"k","military")
    await setupBoard(null,'g','technology')
    await setupBoard(null,'r9k','robot 9000',true)
    await setupBoard(null,'v','videogames')
    await setupBoard(null,'int','international')
    await setupBoard(null,'m','mecha')
    await setupBoard(null,'tv','dr. disrespect')
    await setupBoard(null,'bant','international random')
    await setupBoard(null,'diy','do it yourself')
}

export const dbConnection=await DatabaseConnection.getConnection()
if ((await Board.findAll()).length==0) await setupBasicBoards();