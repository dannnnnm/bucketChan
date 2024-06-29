import { AllowNull, BelongsTo, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "../imageboard/Post.js";
import { Board } from "../imageboard/Board.js";
import { Message } from "./Message.js";

@Table({underscored:true,tableName: "chat_room"})
export class ChatRoom extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    shortName:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    name:string;

    @HasMany(()=>Message,'chatRoomId')
    messages:Message[]

    @HasOne(()=>Board,'chatRoomId')
    board:Board

    



}