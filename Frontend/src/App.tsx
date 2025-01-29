import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

//later create a more elegant useSocket hook
function App() {
  const [text, setText] = useState<string>('');
  const [msg,setMsg]=useState<string>('');
  const [socket,setSocket]=useState<WebSocket>();
  useEffect(()=>{
   //open the socket
    const ws = new WebSocket('ws://localhost:8000');
    setSocket(ws);
    ws.onmessage=(e:MessageEvent)=>{
      setMsg(msg=>msg + e.data + ' ');
    }
    return ()=>{
      //close the socket
      socket?.close();
    }
  },[])
  const handleSend=()=>{
    socket?.send(text);
    setText('');
  }
  return (
    <div style={{display:'flex',gap:15,justifyContent:'center',alignItems:'center',flexDirection:'column',height:'100vh'}}>
      Hello There
      <input value={text} onChange={(e:ChangeEvent<HTMLInputElement>)=>setText(e.target.value)} type='text' placeholder='Lets talk'></input>
      <button onClick={handleSend}>Send</button>
      <div>
            {msg.split(' ').map(text=>{
              return <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {text}
              </div>
            })}
      </div>
    </div>
  )
}

export default App
