import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table } from "sequelize-typescript";
import { User } from "./User.js";
import { Post } from "./imageboard/Post.js";

@Table({underscored:true,tableName: "media",indexes:[{fields:[{name:"hash",collate:"NOCASE"}]}]})
export class Media extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    filename:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    hash:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    mimeType:string;

    @ForeignKey(() => Post)
    @Column(DataType.NUMBER)
    postId:number




}