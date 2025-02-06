import React, { FormEvent, useEffect, useRef, useState } from 'react'

const App = () => {
  const [text, setText] = useState('');
  const [socket, setSocket] = useState<WebSocket>();
  const [chat, setChat] = useState<Array<string>>([]);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    setSocket(ws);
    ws.onmessage = async (e: MessageEvent) => {
      if (e.data instanceof Blob) {
        const text = await e.data.text(); // Convert Blob to text
        setChat(chat => [...chat, text]);
      } else {
        setChat(chat => [...chat, e.data]);
      }
    }
    ws.onclose=()=>{
           alert('chat closed!')
    }
  }, [])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.send(text);
    setText('');
  }

  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])
  return (
    <div className='h-screen flex flex-col justify-center bg-zinc-800 text-white'>
      <h1 className='text-center text-2xl pt-5'
      >Chat App Prototype</h1>

      <div className='w-[50vw] mx-auto'>
        <div className='pb-5 text-black relative justify-end rounded-md  items-center bg-red-200 h-[50vh] mt-5 overflow-y-auto'>
          <div className='h-full flex flex-col'>
            {chat.map(msg => {
              return <div className='bg-red-300 self-center p-1 rounded-lg m-1'
              >{msg}</div>
            })}
            <div ref={anchorRef} className="h-1 bg-green-300"></div>
          </div>
        </div>
        <form onSubmit={handleSubmit}
          className=' text-center mt-2'>
          <input value={text} onChange={(e) => setText(e.target.value)}
            className=' bg-slate-200 text-black p-1 rounded-md outline-none'
            placeholder='Type a messaage' />
          <button type='submit'
            className='mx-2 bg-zinc-700 p-1 rounded-md cursor-pointer hover:bg-zinc-600'
          >Send</button>
        </form>
      </div>
    </div>
  )
}

export default App
