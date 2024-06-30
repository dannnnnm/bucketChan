import Joi from "joi";
import { Board } from "../../models/imageboard/Board.js";
import { ChatRoom } from "../../models/chat/ChatRoom.js";
import { User } from "../../models/User.js";
import { DataType, Sequelize } from "sequelize-typescript";
import { dbConnection } from "../../../index.js";


export const boardCreationValidator=Joi.object({
        shortName:Joi.string().max(6).required(),
        name: Joi.string().max(100).required(),
        creatorId: Joi.number().min(1)
})

export async function setupBoard(creatorUserId,shortName,name):Promise<{ok:boolean,savedBoard:any,error:any}>{
    let transaction=await dbConnection.transaction();
    try {
        let creator = await User.findByPk(creatorUserId);
        let creatorId=creator?creator.id:null
        let board = new Board({
            shortName,
            name,
            creatorId
        })
        let savedBoard = await board.save({ transaction })
        let chatRoom = new ChatRoom({
            shortName,
            name,
            board: savedBoard
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

