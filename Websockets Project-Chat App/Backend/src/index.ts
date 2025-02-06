import { WebSocket, WebSocketServer } from 'ws'
import crypto from 'crypto'
const wss = new WebSocketServer({ port: 8000 });

let userCount=0;
// let allSockets:Array<WebSocket>=[];
interface roomObject{
    code:string;
    sockets:Array<WebSocket>
}
const getRoomCode = ()=> crypto.randomBytes(2).toString('hex');
let currRoom:string=getRoomCode();
let rooms:Array<roomObject>=[{
    code:currRoom,
    sockets:[]
}];
wss.on('connection',(ws) => {
    userCount++;
    console.log(userCount);
    // allSockets.push(ws);
    if(userCount>2){
        currRoom = getRoomCode();
        rooms.push({
            code:currRoom,
            sockets:[ws]
        });
        userCount=0;
    }else{
        const targetRoom = rooms.find(room=>room.code == currRoom);
        targetRoom?.sockets.push(ws);
    }
    ws.on('message', msg => {
        console.log(rooms);
        // allSockets.forEach((websocket) => {
        //     if (websocket != ws ) {
        //         websocket.send(msg.toString())
        //     }
        // })
        rooms.forEach(room=>{
            if(room.sockets.includes(ws)){
                room.sockets.forEach(ws=>ws.send(msg))
            }
        })
    })
})
