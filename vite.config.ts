import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/$/, '')
  // 미리보기 이미지 캐시 강제 갱신: VITE_OG_IMAGE_VERSION=2 등 설정 후 재빌드하면 ?v=2 붙음
  const imageVersion = (env.VITE_OG_IMAGE_VERSION ?? '').trim()
  const versionQuery = imageVersion ? `?v=${imageVersion}` : ''
  // 카카오/메신저 크롤러는 절대 URL만 인식함. 배포 시 VITE_SITE_URL 필수.
  const ogImageUrl = (siteUrl ? `${siteUrl}/cover.jpeg` : '/cover.jpeg') + versionQuery
  const ogUrl = siteUrl // 빌드 시 없으면 og:url은 placeholder 유지
  const parentOgImageUrl = (siteUrl ? `${siteUrl}/cover-parent-feed.jpeg` : '/cover-parent-feed.jpeg') + versionQuery
  const parentOgUrl = siteUrl ? `${siteUrl}/parent` : '/parent'

  let buildOutDir = 'dist'

  return {
  plugins: [
    react(),
    {
      name: 'inject-og-urls',
      configResolved(config) {
        buildOutDir = config.build.outDir
      },
      transformIndexHtml(html) {
        let out = html.replace(/__OG_IMAGE_URL__/g, ogImageUrl)
        if (ogUrl) out = out.replace(/__OG_URL__/g, ogUrl)
        return out
      },
      closeBundle() {
        const indexPath = join(process.cwd(), buildOutDir, 'index.html')
        if (!existsSync(indexPath)) return
        let parentHtml = readFileSync(indexPath, 'utf-8')
        parentHtml = parentHtml.split(ogImageUrl).join(parentOgImageUrl)
        if (ogUrl) parentHtml = parentHtml.split(ogUrl).join(parentOgUrl)
        parentHtml = parentHtml.split('__OG_URL__').join(parentOgUrl)
        writeFileSync(join(process.cwd(), buildOutDir, 'parent.html'), parentHtml, 'utf-8')
      },
    },
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
          } else if (url === '/cover-parent.jpeg' || url === '/cover-parent.jpg' || url === '/cover-parent.png') {
            optimizedPath = join(cwd, 'public', 'cover-parent-optimized.jpg')
          } else if (url === '/cover-feed.jpeg' || url === '/cover-feed.jpg') {
            if (existsSync(join(cwd, 'public', 'cover-feed.jpeg'))) optimizedPath = join(cwd, 'public', 'cover-feed.jpeg')
            else if (existsSync(join(cwd, 'public', 'cover-feed.jpg'))) optimizedPath = join(cwd, 'public', 'cover-feed.jpg')
            else optimizedPath = join(cwd, 'public', 'cover-feed-optimized.jpg')
          } else if (url === '/cover-parent-feed.jpeg' || url === '/cover-parent-feed.jpg') {
            if (existsSync(join(cwd, 'public', 'cover-parent-feed.jpeg'))) optimizedPath = join(cwd, 'public', 'cover-parent-feed.jpeg')
            else if (existsSync(join(cwd, 'public', 'cover-parent-feed.jpg'))) optimizedPath = join(cwd, 'public', 'cover-parent-feed.jpg')
            else optimizedPath = join(cwd, 'public', 'cover-parent-feed-optimized.jpg')
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
  }
})
