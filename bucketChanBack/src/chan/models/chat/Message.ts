import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { ChatRoom } from "./ChatRoom.js";

@Table({underscored:true,tableName: "message"})
export class Message extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    content:string;

    
    @ForeignKey(() => ChatRoom)
    @Column(DataType.NUMBER)
    chatRoomId:number

    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    authorId:number

}