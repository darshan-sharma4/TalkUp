import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{

        origin:["http://localhost:5173"],
        methods:["GET","POST"],
        credentials:true,
    }
});

export function getReceiverSocketId(userId){
return usersocketMap[userId]
}

//used to store login users
const usersocketMap = {}; //{userId:socketId}

io.on("connection", (Socket)=>{
console.log("A new connected user :",Socket.id);

const userId= Socket.handshake.query.userId;
if(userId) usersocketMap[userId] = Socket.id;

//emits all online users
io.emit("getOnlineUsers",Object.keys(usersocketMap));

Socket.on("disconnect",()=>{
    console.log("User disconnected", Socket.id)
    delete usersocketMap[userId]
    io.emit("getOnlineUsers",Object.keys(usersocketMap));
})
})
export {io,app,server};