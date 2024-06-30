import { AllowNull, BelongsTo, Column, DataType, HasMany, HasOne, Index, Model, Table, Unique } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "./Post.js";
import { ChatRoom } from "../chat/ChatRoom.js";

@Table({underscored:true,tableName: "board",indexes:[{fields:[{name:"short_name",collate:"NOCASE"}]}]})
export class Board extends Model{
    @AllowNull(false)
    @Column(DataType.TEXT)
    shortName:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    name:string;

    @HasMany(()=>Post,'boardId')
    threads:Post[]

    @BelongsTo(()=>User,'creatorId')
    creator?:User

    @HasOne(()=>ChatRoom,'chatRoomId')
    chatRoom:ChatRoom



}