import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Index, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "../imageboard/Post.js";
import { Board } from "../imageboard/Board.js";
import { Message } from "./Message.js";

@Table({underscored:true,tableName: "chat_room",indexes:[{fields:[{name:"short_name",collate:"NOCASE"}]}]})
export class ChatRoom extends Model{
    @AllowNull(false)
    @Column(DataType.TEXT)
    shortName:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    name:string;

    @HasMany(()=>Message)
    messages:Message[]

    @ForeignKey(() =>Board)
    @Column(DataType.NUMBER)
    boardId:number

}
