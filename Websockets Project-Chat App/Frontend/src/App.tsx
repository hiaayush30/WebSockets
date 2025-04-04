import { FormEvent, useEffect, useRef, useState } from 'react'

const App = () => {
  const [text, setText] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>();
  const [chat, setChat] = useState<Array<string>>([]);
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [loading,setLoading] = useState(false);

  const handleNewRoom = () => {
    setLoading(true);
    const ws = new WebSocket(import.meta.env.VITE_BE_DOMAIN+':8000');
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
      ws.send(JSON.stringify({
        type: 'join'
      }));
    }
    ws.onmessage = (e: MessageEvent) => {
      const message = JSON.parse(e.data);
      console.log(message);
      if (message.type == 'join') {
        if (message.payload.roomId) {
          setRoomCode(message.payload.roomId);
        }
        setChat(chat => [...chat, message.payload.message]);
      } else {
        setChat(chat => [...chat, message.payload.message])
      }
    }
    ws.onclose = () => {
      alert('session closed!');
      setChat(chat => [...chat, "session terminated"]);
      setSocket(null);
      setRoomCode('');
    }
  }
  const handleJoinRoom = () => {
    if (joinRoomCode.trim().length != 4) {
      return alert('Enter a valid code!');
    }
    setLoading(true);
    const ws = new WebSocket(import.meta.env.VITE_BE_DOMAIN+':8000');
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
      ws.send(JSON.stringify({
        type: 'join',
        payload: {
          roomId: joinRoomCode
        }
      }));
      ws.onmessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        console.log(message);
        if (message.type == 'join') {
          if (message.payload.roomId) {
            setRoomCode(message.payload.roomId);
          }
          setChat(chat => [...chat, message.payload.message]);
        } else {
          setChat(chat => [...chat, message.payload.message])
        }
      }
      ws.onclose = () => {
        alert('session closed!');
        setChat(chat => [...chat, "session terminated"]);
        setSocket(null);
        setRoomCode('');
      }
    }
  }

  const handleCloseSocket = () => {
    socket?.close();
    setSocket(null);
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.send(JSON.stringify({
      type: 'chat',
      payload: {
        message: text
      }
    }));
    setText('');
  }

  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])
  return (
    <div className='h-screen flex flex-col justify-center bg-zinc-800 text-white'>
      <h1 className='text-center text-2xl pt-5'
      >Chat Rooms : Chat and Forget</h1>
      <div className='flex justify-center items-center gap-3'>
        <p className=''>Room Code:</p>
        <input className='w-16 text-slate-200' disabled type='text' value={roomCode} />
      </div>
      <div className='w-[50vw] mx-auto max-sm:w-[80vw]'>
        <div className='pb-5 text-black relative justify-end rounded-md  items-center bg-red-200 h-[50vh] mt-5 overflow-y-auto'>
          <div className='h-full flex flex-col'>
            {chat.map((msg, index) => {
              return <div key={index} className='bg-red-300 self-center p-1 rounded-lg m-1'
              >{msg}</div>
            })}
            <div ref={anchorRef} className="h-1"></div>
          </div>
        </div>
        <form onSubmit={handleSubmit}
          className=' text-center mt-2'>
          {socket && <>
            <input value={text} onChange={(e) => setText(e.target.value)}
              className=' bg-slate-200 text-black p-1 rounded-md outline-none'
              placeholder='Type a messaage' />
            <button type='submit'
              className='mx-2 bg-zinc-700 p-1 rounded-md cursor-pointer hover:bg-zinc-600'
            >Send</button>
            <button onClick={handleCloseSocket}
              className='bg-red-600 max-sm:absolute max-sm:top-2 max-sm:left-2 text-slate-200 rounded-md p-1 cursor-pointer'>TERMINATE</button></>}
        </form>
        {!socket && <div className='flex gap-5 items-center justify-center w-full'>
          <button disabled={loading} className={`${loading ? 'bg-red-300':'bg-red-600'} p-1 cursor-pointer rounded-md`} onClick={handleNewRoom}>new chat</button>
          <div className='border-2 rounded-md'>
            <input value={joinRoomCode} onChange={e => setJoinRoomCode(e.target.value)}
              type='text' placeholder='room code' className='p-1 outline-none' />
            <button disabled={loading} onClick={handleJoinRoom} className={`${loading ? 'bg-red-300':'bg-red-600'} p-1 cursor-pointer rounded-md`}>JOIN</button>
          </div>
          <div onClick={()=>setChat([])} 
          className='bg-slate-700 rounded-md p-1 cursor-pointer'>Clear Chat</div>
        </div>}
      </div>
    </div>
  )
}

export default App
