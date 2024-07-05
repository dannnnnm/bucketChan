import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Board } from "./Board.js";
import { Media } from "../Media.js";
import { Sequelize } from "sequelize";

@Table({underscored:true,tableName: "post"})
export class Post extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    title:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    body:string;

    @HasMany(()=>Media,'postId')
    media:Media[];

    @ForeignKey(() => Post)
    @Column(DataType.NUMBER)
    threadId?:number

    @HasMany(()=>Post,{foreignKey:'thread_id'})
    responses:Post[]

    @ForeignKey(() => Board)
    @Column(DataType.NUMBER)
    boardId:number

    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    authorId?:number

    @Default(new Date())
    @Column(DataType.DATE)
    bumpedAt:Date;

    @Default(true)
    @Column(DataType.BOOLEAN)
    active:boolean

    @Default(false)
    @Column(DataType.BOOLEAN)
    encrypted:boolean

    @AllowNull(true)
    @Column(DataType.STRING)
    encryptedMessage?:string

    public isResponse():boolean{
        return this.threadId!=null;
    }

    public bump(){
        this.bumpedAt=new Date()
    }

    
 


}