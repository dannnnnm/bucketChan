import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "../imageboard/Post.js";

@Table({underscored:true,tableName: "message"})
export class Message extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    content:string;

    

    @HasMany(()=>Post)
    threads:Post[]

    @BelongsTo(()=>User)
    @AllowNull(true)
    author:User



}