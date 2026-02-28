/**
 * 이미지 최적화: 갤러리 + cover + invitation
 * - 긴 변 최대 1200px, JPEG 품질 82
 *
 * 사용법:
 *   pnpm run optimize:gallery              → public/gallery-optimized, cover-optimized.jpg, invitation-optimized.jpg
 *   pnpm run optimize:gallery -- --replace → gallery 만 원본 백업 후 최적화본으로 교체
 */
import { readdirSync, mkdirSync, renameSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')
const galleryDir = join(publicDir, 'gallery')
const optimizedDir = join(publicDir, 'gallery-optimized')

const MAX_LONG_EDGE = 1200
const JPEG_QUALITY = 82
const numberedImage = /^\d+\.(jpg|jpeg|png|gif|webp)$/i
const imageExt = /\.(jpg|jpeg|png|gif|webp)$/i

async function optimizeOne(sharp, srcPath, outPath, label) {
  const fs = await import('fs')
  const stat = await fs.promises.stat(srcPath).catch(() => null)
  const before = stat?.size ?? 0
  await sharp
    .default(srcPath)
    .resize(MAX_LONG_EDGE, MAX_LONG_EDGE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath)
  const afterStat = await fs.promises.stat(outPath)
  const pct = before ? Math.round((1 - afterStat.size / before) * 100) : 0
  console.log(`  ${label}: ${(before / 1024 / 1024).toFixed(2)} MB → ${(afterStat.size / 1024).toFixed(0)} KB (${pct}% 감소)`)
  return { before, after: afterStat.size }
}

async function main() {
  const replace = process.argv.includes('--replace')

  const sharp = await import('sharp').catch(() => null)
  if (!sharp?.default) {
    console.error('sharp 패키지가 필요합니다. 실행: pnpm add -D sharp')
    process.exit(1)
  }

  console.log(`최적화: 긴 변 ${MAX_LONG_EDGE}px, 품질 ${JPEG_QUALITY}%`)

  let totalBefore = 0
  let totalAfter = 0

  // 1) cover.png / cover.jpeg 등 → cover-optimized.jpg
  const publicFiles = readdirSync(publicDir)
  const coverFile = publicFiles.find((f) => /^cover\.(jpeg|jpg|png|webp|gif)$/i.test(f))
  if (coverFile) {
    const out = await optimizeOne(
      sharp,
      join(publicDir, coverFile),
      join(publicDir, 'cover-optimized.jpg'),
      `cover (${coverFile})`
    )
    totalBefore += out.before
    totalAfter += out.after
  }

  // 1-2) cover-parent.* → cover-parent-optimized.jpg (부모님용 공유 이미지)
  const coverParentFile = publicFiles.find((f) => /^cover-parent\.(jpeg|jpg|png|webp|gif)$/i.test(f))
  if (coverParentFile) {
    const out = await optimizeOne(
      sharp,
      join(publicDir, coverParentFile),
      join(publicDir, 'cover-parent-optimized.jpg'),
      `cover-parent (${coverParentFile})`
    )
    totalBefore += out.before
    totalAfter += out.after
  }

  // 2) invitation.png / invitation.jpg 등 → invitation-optimized.jpg
  const invitationFile = publicFiles.find((f) => /^invitation\.(jpeg|jpg|png|webp|gif)$/i.test(f))
  if (invitationFile) {
    const out = await optimizeOne(
      sharp,
      join(publicDir, invitationFile),
      join(publicDir, 'invitation-optimized.jpg'),
      `invitation (${invitationFile})`
    )
    totalBefore += out.before
    totalAfter += out.after
  }

  // 3) 갤러리
  let galleryFiles = []
  try {
    galleryFiles = readdirSync(galleryDir).filter((f) => numberedImage.test(f))
  } catch {
    // gallery 없으면 스킵
  }
  if (galleryFiles.length > 0) {
    mkdirSync(optimizedDir, { recursive: true })
    for (const file of galleryFiles) {
      const srcPath = join(galleryDir, file)
      const outPath = join(optimizedDir, file.replace(/\.[a-z]+$/i, '.jpg'))
      const stat = await import('fs').then((fs) => fs.promises.stat(srcPath).catch(() => null))
      const before = stat?.size ?? 0
      totalBefore += before
      await sharp
        .default(srcPath)
        .resize(MAX_LONG_EDGE, MAX_LONG_EDGE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(outPath)
      const afterStat = await import('fs').then((fs) => fs.promises.stat(outPath))
      totalAfter += afterStat.size
      const pct = before ? Math.round((1 - afterStat.size / before) * 100) : 0
      console.log(`  gallery/${file}: ${(before / 1024 / 1024).toFixed(2)} MB → ${(afterStat.size / 1024).toFixed(0)} KB (${pct}% 감소)`)
    }
  }

  if (totalBefore > 0) {
    console.log(`\n총 용량: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`)
  }

  if (galleryFiles.length > 0) {
    if (replace) {
      const backupDir = join(root, 'public', 'gallery-backup')
      if (existsSync(backupDir)) {
        console.error('이미 gallery-backup 폴더가 있습니다. 수동으로 정리한 뒤 다시 실행하세요.')
        process.exit(1)
      }
      console.log('\n기존 gallery → gallery-backup, gallery-optimized → gallery 로 교체 중...')
      renameSync(galleryDir, backupDir)
      renameSync(optimizedDir, galleryDir)
      console.log('완료. 원본은 public/gallery-backup 에 있습니다.')
    }
  }
  if (!replace && (galleryFiles.length > 0 || coverFile || coverParentFile || invitationFile)) {
    console.log('\n최적화본: public/gallery-optimized, public/cover-optimized.jpg, public/cover-parent-optimized.jpg, public/invitation-optimized.jpg')
    if (galleryFiles.length > 0) console.log('갤러리만 원본 교체: pnpm run optimize:gallery -- --replace')
  }
  if (totalBefore === 0 && !coverFile && !coverParentFile && !invitationFile) {
    console.log('최적화할 이미지가 없습니다. (public/cover.*, public/cover-parent.*, public/invitation.*, public/gallery/)')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
