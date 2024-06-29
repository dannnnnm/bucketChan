import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User.js";
import { Post } from "./imageboard/Post.js";

@Table({underscored:true,tableName: "media"})
export class Media extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    filename:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    hash:string;

    @BelongsTo(()=>Post)
    post:Post




}