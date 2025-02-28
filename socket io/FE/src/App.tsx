import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const App = () => {
  const [text, setText] = useState("disconnected");
  const [socket, setSocket] = useState<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const socket = io("http://localhost:3000"); //base url required here 
    //if not passed anything takes the FE url as default
    socket.on("connect", () => {
      setSocket(socket);
      setText("connected:" + socket.id);
    });
    socket.on("welcome", (message) => {
      alert(message);
    })

    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 25,
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw"
    }}>
      {text}
      <input ref={inputRef} type='text' placeholder='Enter data' />
      <button onClick={() => {
        if (!inputRef.current) return;
        socket?.emit("data", inputRef.current.value);
        inputRef.current.value = "";
      }}>Submit</button>
    </div>
  )
}

export default App
