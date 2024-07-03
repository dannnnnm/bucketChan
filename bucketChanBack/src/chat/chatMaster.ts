import { Server, Socket } from "socket.io";
import { User } from "../chan/models/User.js";
import { ChatRoom } from "../chan/models/chat/ChatRoom.js";

const generalRoomName="generalRoom";
var serverSocket:Server<any, any, any, any>;
var roomParticipants=new Map<string,{user:User,clientSocket:Socket<any, any, any, any>,ip:string}[]>()

export async function initSocket(server){
    serverSocket=new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    });
    let existingChatrooms=await ChatRoom.findAll();
    existingChatrooms.forEach((chatroom)=>{
        roomParticipants.set(chatroom.shortName,[]);
    })
    roomParticipants.set(generalRoomName,[]);
    serverSocket.on('connection', (userSocket) => {
        //por default se une a la sala general
        console.log("socket ",userSocket.handshake.address)
        if (isIpInUse(userSocket.handshake.address)) userSocket.disconnect();
        userSocket.on('joinRoom', async (room, userData) => {
            userSocket.join(room);
            let user:User;
            let isAnon=true;
            if (!userData.username) return 
            let ip;
            if (userData.username!="anon"){
                user=await User.findOne({where:{username:userData.name}})
                isAnon=false;
            }
            else{
                let anonCount=0
                roomParticipants.forEach((value,key)=>{
                    let foundAnons=value.filter(userData=>/anon [0-9]+/.test(userData.user.username));
                    foundAnons.forEach((anon)=>{
                        anonCount++;
                    })
                })
                user=new User({
                    username:`anon ${anonCount+1}`
                })
                ip=userSocket.handshake.address
            }
            roomParticipants.get(room).push({user,clientSocket:userSocket,ip})
            
            console.log(`${user.username} joined ${room}`)
            serverSocket.to(room).emit("joinRoom",{message:`${user.username} joined`,author:"system"})
        })

        userSocket.on('message', (msg) => {
            let {user,room,found}=findUserAndRoomFromWS(userSocket)
            serverSocket.to(room).emit('message', {message:msg,author:user.username});

        });

        // Disconnect
        userSocket.on('disconnect', () => {
            let found=false;
            let pair:{user:User,clientSocket:Socket<any, any, any, any>,ip:string};
            let eventRoom="";
            roomParticipants.forEach((value,key)=>{
                if (found) return;
                let foundSocket=value.filter(pair=>pair.clientSocket==userSocket);
                if (foundSocket.length>0){
                    found=true;
                    pair=foundSocket[0];
                    eventRoom=key;
                }
            })
            if (found && !isIpInUse(userSocket.handshake.address)){
                serverSocket.to(eventRoom).emit("userDisconnect",{message:`${pair.user.username} has disconnected!`,author:"system"})
                console.log('user disconnected');
            }
            
        });
    })

}

function findUserAndRoomFromWS(websocket):{user:User,room:string,pair:any,found:boolean}{
    let found=false;
    let user:User;
    let room:string;
    let pair:any;
    roomParticipants.forEach((value,key)=>{
        if (found) return;
        let userMatch=value.filter(pair=>pair.clientSocket==websocket);
        if (userMatch.length>0){
            found=true;
            user=userMatch[0].user;
            room=key;
            pair=userMatch[0]
        }
    })
    console.log("disco found ",found)
    return {found,user,room,pair}

}

function isIpInUse(ip:string):boolean{
    let found=false;
    roomParticipants.forEach((value,key)=>{
        if (found) return;
        let userMatch=value.filter(pair=>pair.ip==ip);
        if (userMatch.length>0){
            found=true;
        }
    })
    return found;
}