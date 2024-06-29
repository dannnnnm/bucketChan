import { AllowNull, BelongsTo, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "./Post.js";
import { ChatRoom } from "../chat/ChatRoom.js";

@Table({underscored:true,tableName: "board"})
export class Board extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    shortName:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    name:string;

    @HasMany(()=>Post,'boardId')
    threads:Post[]

    @BelongsTo(()=>User,'creatorId')
    creator?:User

    @BelongsTo(()=>ChatRoom,'chatRoomId')
    chatRoom:ChatRoom



}