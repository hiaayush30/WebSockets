import { WebSocket, WebSocketServer } from 'ws'
import crypto from 'crypto'
const wss = new WebSocketServer({ port: 8000 });

let userCount=0;
interface roomObject{
    code:string;
    sockets:Array<WebSocket>
}
const getRoomCode = ()=> crypto.randomBytes(2).toString('hex');
let currRoom:string=getRoomCode();
let rooms:Array<roomObject>=[{  //creating the initial room
    code:currRoom,
    sockets:[]
}];
wss.on('connection',(ws) => {
    if(userCount>=2){
        currRoom = getRoomCode();
        rooms.push({
            code:currRoom,
            sockets:[ws]
        });
        userCount=1;
        ws.send('waiting for another user...');
    }
    else if (userCount == 0){                //1st ever user
        const targetRoom = rooms.find(room=>room.code == currRoom);
        targetRoom?.sockets.push(ws);
        ws.send('waiting for another user...');
        userCount++;
    }
    else{
        const targetRoom = rooms.find(room=>room.code == currRoom);
        targetRoom?.sockets.push(ws);
        userCount++;
        targetRoom?.sockets.forEach((socket)=>{
          socket.send('new user joined!')
        })
    }
    console.log(userCount);
    ws.on('message', msg => {
        console.log(rooms);
        rooms.forEach(room=>{
            if(room.sockets.includes(ws)){
                room.sockets.forEach(ws=>ws.send(msg))
            }
        })
    });
    ws.on('close',()=>{
        const closingRoom=rooms.find(room=>room.sockets.includes(ws));
        closingRoom?.sockets.forEach(socket=>{   //remove the room as only 2 sockets present
            socket.close()
        })
        rooms=rooms.filter(room=>room!=closingRoom); 
    })
})
