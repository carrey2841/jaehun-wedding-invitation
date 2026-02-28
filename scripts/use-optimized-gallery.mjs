/**
 * 빌드 후 dist 에서 최적화본으로 교체.
 * - gallery: dist/gallery-optimized → dist/gallery
 * - cover: dist/cover-optimized.jpg → dist/cover.jpeg (앱/ preload 경로)
 * - invitation: dist/invitation-optimized.jpg → dist/invitation.jpg
 */
import { rmSync, renameSync, existsSync, copyFileSync, unlinkSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

// 1) 갤러리
const galleryDir = join(distDir, 'gallery')
const galleryOptimized = join(distDir, 'gallery-optimized')
if (existsSync(galleryOptimized)) {
  rmSync(galleryDir, { recursive: true, force: true })
  renameSync(galleryOptimized, galleryDir)
  console.log('배포용 갤러리: 최적화본으로 교체됨 (dist/gallery)')
}

// 2) cover → cover.jpeg 로 서빙
const coverOpt = join(distDir, 'cover-optimized.jpg')
if (existsSync(coverOpt)) {
  for (const name of readdirSync(distDir)) {
    if (/^cover\.(jpeg|jpg|png|webp|gif)$/i.test(name)) rmSync(join(distDir, name), { force: true })
  }
  copyFileSync(coverOpt, join(distDir, 'cover.jpeg'))
  unlinkSync(coverOpt)
  console.log('배포용 커버: cover-optimized.jpg → cover.jpeg')
}

// 2-2) cover-parent → cover-parent.jpeg 로 서빙
const coverParentOpt = join(distDir, 'cover-parent-optimized.jpg')
if (existsSync(coverParentOpt)) {
  for (const name of readdirSync(distDir)) {
    if (/^cover-parent\.(jpeg|jpg|png|webp|gif)$/i.test(name)) rmSync(join(distDir, name), { force: true })
  }
  copyFileSync(coverParentOpt, join(distDir, 'cover-parent.jpeg'))
  unlinkSync(coverParentOpt)
  console.log('배포용 부모님 커버: cover-parent-optimized.jpg → cover-parent.jpeg')
}

// 3) invitation → invitation.jpg 로 서빙
const invOpt = join(distDir, 'invitation-optimized.jpg')
if (existsSync(invOpt)) {
  for (const name of readdirSync(distDir)) {
    if (/^invitation\.(jpeg|jpg|png|webp|gif)$/i.test(name)) rmSync(join(distDir, name), { force: true })
  }
  copyFileSync(invOpt, join(distDir, 'invitation.jpg'))
  unlinkSync(invOpt)
  console.log('배포용 청첩문: invitation-optimized.jpg → invitation.jpg')
}
