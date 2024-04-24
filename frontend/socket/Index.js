import { Server } from 'socket.io';

const io = new Server(8900, {
    cors: {
        origin: "http://localhost:5000"
    }
});
    
let users = [];


//methods

const addUser = (userId, socketId)=>{
    !users.some((user)=> user.userId === userId) && 
    users.push({userId, socketId , lastSeen: Date.now() })
}


const removeUser = (socketId)=>{
    users = users.filter((user)=>{
        return user.socketId!== socketId;
    })
}


const getUser = (userId)=>{
    return users.find((user)=>user.userId === userId)
}


const updateUserLastSeen = (socketId) => {
    const user = users.find(user => user.socketId === socketId);
    if (user) {
        user.lastSeen = Date.now();
    }
};


const isUserActive = (lastSeen) => {
    const heartbeatInterval = 60000; // 1 minute interval for heartbeat
    return Date.now() - lastSeen <= heartbeatInterval;
};


const emitActiveStatus = () => {
    const activeUsers = users.map(user => ({
        userId: user.userId,
        active: isUserActive(user.lastSeen)
    }));
    io.emit("activeStatus", activeUsers);
    console.log("active user from socket",activeUsers)
};






io.on("connection", (socket) => {
  
console.log("server started");

    
    socket.on("adduser" , (userId)=>{
        addUser(userId, socket.id);
        io.emit("getUsers" , users)
    });



    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text
            });
      
        } else {
            console.error('User not found:', receiverId);
        }
    });



    socket.on("typing", ({ receiverId }) => {
       
        const user = getUser(receiverId); 
        if (user) {
            io.to(user.socketId).emit("typingsent", {
                senderId: socket.id,
            });
      
        } else {
            console.error('User not found:', receiverId);
            console.log(users)
        }
    });



    socket.on("stopTyping", ({ receiverId }) => {
       
    const user = getUser(receiverId); 
    if (user) {
        console.log(user);
        io.to(user.socketId).emit("stopTypingsent", {
            senderId: socket.id, 
        });
    } else {
        console.error('User not found:', receiverId);
    }
});

 
    socket.on("disconnect" , ()=>{
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    socket.on("heartbeat", () => {
        updateUserLastSeen(socket.id);
    });
   
});

setInterval(emitActiveStatus, 60000);