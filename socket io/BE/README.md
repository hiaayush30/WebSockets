### Every client has a socket which has a id
### io is the collection of all sockets

- socket.emit(event,data) =>to that socket
- io.emit(event,data)+> to all sockets
- io.to(socketId).emit(event,data) => to the socket with the socketId
- socket.broadcast.emit(event,data) => to all sockets except that one
### room to club sockets
- socket.join(roomName) socket will join that room;
- io.to(roomName).emit(event,data)