import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, Index, Model, Table, Unique } from "sequelize-typescript";
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

    @Default(false)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isr9k:boolean

    @HasMany(()=>Post,'boardId')
    threads:Post[]

    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    creatorId?:number

    @HasOne(()=>ChatRoom,'boardId')
    chatRoom:ChatRoom




}