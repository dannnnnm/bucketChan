import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Post } from "./Post.js";

@Table({underscored:true,tableName: "board"})
export class Board extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    shortName:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    name:string;

    @HasMany(()=>Post)
    threads:Post[]

    @BelongsTo(()=>User)
    @AllowNull(true)
    author?:User



}