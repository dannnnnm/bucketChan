import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../User.js";
import { Board } from "./Board.js";
import { Media } from "../Media.js";

@Table({underscored:true,tableName: "post"})
export class Post extends Model{
    @AllowNull(true)
    @Column(DataType.TEXT)
    title:string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    body:string;

    @HasMany(()=>Media,'mediaId')
    media:Media[];

    @BelongsTo(()=>Post, {foreignKey:'thread_id',as:'Thread'})
    thread?:Post

    @HasMany(()=>Post,{foreignKey:'thread_id',as:'Responses'})
    responses:Post[]

    @BelongsTo(()=>Board,'boardId')
    board:Board

    @BelongsTo(()=>User,'authorId')
    author?:User

    @Column(DataType.DATE)
    bumpedAt:Date;

    @Column(DataType.BOOLEAN)
    active:boolean

    @Column(DataType.BOOLEAN)
    encrypted:boolean

    @AllowNull(true)
    @Column(DataType.STRING)
    encryptedMessage?:string

    public isResponse():boolean{
        return this.thread!=null;
    }

    
 


}