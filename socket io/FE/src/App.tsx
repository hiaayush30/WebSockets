import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const App = () => {
  const [text, setText] = useState("disconnected")
  useEffect(() => {
    const socket = io("http://localhost:3000"); //base url required here 
    //if not passed anything takes the FE url as default
    socket.on("connect", () => {
      setText("connected:" +socket.id);
    });
    socket.on("welcome",(message)=>{
      alert(message);
    })
  }, [])
  return (
    <div>
      {text}
    </div>
  )
}

export default App
