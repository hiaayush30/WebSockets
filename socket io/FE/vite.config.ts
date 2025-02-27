import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server:{
  //   proxy:{
  //     '/api':{   //append before /api
  //       target:'http://localhost:3000', 
  //       changeOrigin:true
  //     }
  //   }
  // }
})

// If frontend & backend are on the same server → /api/posts works as expected.
// If frontend is static & backend is separate → use the full backend URL.
// If using a reverse proxy → /api/posts can be routed to the backend.