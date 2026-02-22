import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-optimized-images',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] ?? ''
          const cwd = process.cwd()
          let optimizedPath = ''
          let contentType = 'image/jpeg'
          if (url.startsWith('/gallery/')) {
            const filename = url.slice('/gallery/'.length)
            optimizedPath = join(cwd, 'public', 'gallery-optimized', filename)
            const ext = filename.replace(/.*\./, '').toLowerCase()
            const types: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }
            contentType = types[ext] ?? contentType
          } else if (url === '/cover.jpeg' || url === '/cover.jpg' || url === '/cover.png') {
            optimizedPath = join(cwd, 'public', 'cover-optimized.jpg')
          } else if (url === '/invitation.jpg' || url === '/invitation.png') {
            optimizedPath = join(cwd, 'public', 'invitation-optimized.jpg')
          }
          if (!optimizedPath || !existsSync(optimizedPath)) return next()
          res.setHeader('Content-Type', contentType)
          createReadStream(optimizedPath).pipe(res)
        })
      },
    },
  ],
  server: {
    host: true, // 같은 Wi-Fi의 휴대폰에서 http://<맥IP>:5173 으로 접속 가능
  },
})
