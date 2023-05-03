const {Server} =require("socket.io");
const express = require("express");
const cors = require("cors");

const app= express();
const PORT = process.env.PORT || 8001;

app.use(cors());

app.get("/",(req,res) => {
    res.send("HII I am Live (This is neeraj here)");
    console.log("you are from ip "+req.ip);
});

const io=new Server(8000, {
    cors:true,
});

const emailToSocketIdMapp = new Map();
const socketIdToEmailMap = new Map();

const start = async () => {
    try {
        app.listen(PORT,() => {
            console.log('yes i am connected at Port '+PORT);

            io.on("connection",socket=>{
                console.log("Socket Connected ",socket.id);
                socket.on("room:join",(data) => {
                    console.log(data);
                    const {email ,room} = data;
                    emailToSocketIdMapp.set(email,socket.id);
                    socketIdToEmailMap.set(socket.id,email);
                    io.to(room).emit("user:joined",{email, id: socket.id });
                    socket.join(room);
                    io.to(socket.id).emit("room:join" , data);
                });
            
                socket.on('user:call', ({to, offer}) => {
                    io.to(to).emit("incomming:call", {from: socket.id, offer});
                });
            
                socket.on('call:accepted', ({to , ans}) => {
                    io.to(to).emit("call:accepted", {from: socket.id, ans});
                });
                
                socket.on('peer:nego:needed',({to,offer}) => {
                    io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
                });
            
                socket.on("peer:nego:done",({to,ans}) => {
                    io.to(to).emit("peer:nego:final",{from:socket.id,ans});
                })
            });

        });
    }catch (error){
        console.log(error);
    }
};
start();


// io.on("connection",socket=>{
//     console.log("Socket Connected ",socket.id);
//     socket.on("room:join",(data) => {
//         console.log(data);
//         const {email ,room} = data;
//         emailToSocketIdMapp.set(email,socket.id);
//         socketIdToEmailMap.set(socket.id,email);
//         io.to(room).emit("user:joined",{email, id: socket.id });
//         socket.join(room);
//         io.to(socket.id).emit("room:join" , data);
//     });

//     socket.on('user:call', ({to, offer}) => {
//         io.to(to).emit("incomming:call", {from: socket.id, offer});
//     });

//     socket.on('call:accepted', ({to , ans}) => {
//         io.to(to).emit("call:accepted", {from: socket.id, ans});
//     });
    
//     socket.on('peer:nego:needed',({to,offer}) => {
//         io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
//     });

//     socket.on("peer:nego:done",({to,ans}) => {
//         io.to(to).emit("peer:nego:final",{from:socket.id,ans});
//     })
// });


// const express = require("express");

// const app= express();

// const PORT = process.env.PORT || 4000;

// app.get("/",(req,res) => {
//     res.send("HII I am Live (This is neeraj here)");
// });
