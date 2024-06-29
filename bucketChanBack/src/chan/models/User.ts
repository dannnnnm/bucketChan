import { AllowNull, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Post } from "./imageboard/Post.js";
import { Message } from "./chat/Message.js";

@Table({underscored:true,tableName: "page_user"})
export class User extends Model{
    @AllowNull(false)
    @Column(DataType.TEXT)
    username:string;


    @AllowNull(false)
    @Column(DataType.TEXT)
    passwordHash:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    role:string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    publicKey:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    profilePicture:string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isLocked:boolean;

    @HasMany(()=>Post)
    posts:Post[]

    @HasMany(()=>Message)
    messages:Message[]
 


}