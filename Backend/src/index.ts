import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });


wss.on('connection', (ws) => {
    console.log('user connected');

    ws.on('message', (data) => {
        if (data.toString() == 'ping') {
            ws.send('pong');
        }
        else if (data.toString() == 'pong') {
            ws.send('ping');
        }
        else {
            broadcast(data.toString());
        }
    })

    ws.send('hello user');
})

const broadcast = (message: string) => {
    wss.clients.forEach(client => {
        if (client.readyState == 1) {   // Ensure the client is open
            client.send(message);
        }
    })
}