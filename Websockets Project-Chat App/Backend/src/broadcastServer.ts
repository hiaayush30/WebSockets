import { WebSocket, WebSocketServer } from 'ws'
import crypto from 'crypto'
const wss = new WebSocketServer({ port: 8000 });

let userCount=0;
let allSockets:Array<WebSocket>=[];
wss.on('connection',(ws) => {
    userCount++;
    allSockets.push(ws);
    console.log(userCount);
    ws.on('message', msg => {
        allSockets.forEach((websocket) => {
            if (websocket != ws ) {
                websocket.send(msg.toString())
            }
        })
    })
})
