const express=require("express");
const path=require('path');
const http=require("http");
const socketio=require("socket.io");
const formatmessages=require("./Utils/messages");
const {userjoin,getcurrentuser,getRoomUsers,userleave}=require("./Utils/users");



const app=express();
const server=http.createServer(app);
const io=socketio(server);
const port=process.env.PORT||3000;

app.use(express.static(path.join(__dirname,'public')));
const potname="chat bot";


io.on("connection",socket=>{
    
    socket.on("joinRoom",({username,room})=>{
        const user=userjoin(socket.id,username,room);
        

        socket.join(user.room);

        socket.emit("message",formatmessages(potname ,"welcome to chatApp"));

        socket.broadcast.to(user.room).emit("message",formatmessages(potname,user.username+ "  has joined the chat"));
    
        io.to(user.room).emit("roomusers",{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    
    });

   

   
    
  



    socket.on("chatmessage",(msg)=>{
        const user=getcurrentuser(socket.id);
        io.to(user.room).emit("message",formatmessages(user.username,msg));
    });

      //io.emit();
      socket.on("disconnect",()=>{
        const user=userleave(socket.id);

        if(user && user.room){
            io.to(user.room).emit("message", formatmessages(potname, user.username + " left the chat"));
    
            io.to(user.room).emit("roomusers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
     
    });
})




server.listen(port,()=>{console.log("http://localhost:"+port)});