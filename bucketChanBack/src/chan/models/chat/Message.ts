import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "../imageboard/Post.js";
import { ChatRoom } from "./ChatRoom.js";

@Table({underscored:true,tableName: "message"})
export class Message extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    content:string;

    
    @BelongsTo(()=>ChatRoom,'chatRoomId')
    chatRoom:ChatRoom

    @BelongsTo(()=>User,'authorId')
    author:User



}