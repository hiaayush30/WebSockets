import { WebSocket, WebSocketServer } from 'ws'
import crypto from 'crypto'
const wss = new WebSocketServer({ port: 8000 });

let userCount = 0;
interface roomObject {
    room: string;
    sockets: Array<WebSocket>
}
const getRoomCode = () => crypto.randomBytes(2).toString('hex');
let rooms: Array<roomObject> = [];

wss.on('connection', (ws) => {
    userCount++;
    console.log(userCount);
    ws.on('message', async msg => {
        let message;
        if (msg instanceof Blob) {
            message = await msg.text();
        } else {
            message = msg.toString();
        }
        message = JSON.parse(message);
        console.log(message);
        if (message?.type == 'join') {
            if (message.payload?.roomId) {  //if roomId present in payload
                //find if such a room exists
                if (!rooms.some(roomObj => roomObj.room == message.payload.roomId)) {
                    ws.send(JSON.stringify({
                        type:'join',
                        payload: {
                            message: 'no room found!'
                        }
                    }))
                    ws.close();
                } else {   //add to the desired room
                    const roomObj = rooms.find(roomObj => roomObj.room == message.payload.roomId);
                    roomObj?.sockets.push(ws);
                    ws.send(JSON.stringify({
                        type: 'join',
                        payload: {
                            message: 'connected to ' + message.payload.roomId,
                            roomId: message.payload.roomId
                        }
                    }))
                }
                //create a new room
            } else {
                const roomId = getRoomCode();
                rooms.push({
                    room: roomId,
                    sockets: [ws]
                })
                ws.send(JSON.stringify({
                    type: 'join',
                    payload: {
                        message: 'you joined room ' + roomId,
                        roomId
                    }
                }))
            }
        } else {               //if message.type =='chat'
            rooms.forEach(roomObj => {
                if (roomObj.sockets.includes(ws)) {
                    roomObj.sockets.forEach(socket => {
                        socket.send(JSON.stringify({
                            type: 'chat',
                            payload: {
                                message:message.payload?.message
                            }
                        }));
                    })
                }
            })
        }
    })

    ws.on('close',()=>{
        rooms.forEach(roomObj=>{
            if(roomObj.sockets.includes(ws)){
                roomObj.sockets=roomObj.sockets.filter(socket=>socket!=ws);
            }
            if(roomObj.sockets.length==0){  //remove the empty rooms
                rooms=rooms.filter(room=>room.room == roomObj.room);
            }
        })
    })
})
