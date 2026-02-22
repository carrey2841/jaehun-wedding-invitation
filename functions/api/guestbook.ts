/**
 * Cloudflare Pages Function: 방명록 API (D1)
 * GET /api/guestbook?limit=5&offset=0
 * POST /api/guestbook { author, password, message }
 * DELETE /api/guestbook { id, password }
 */

const AUTHOR_MAX = 10
const MESSAGE_MAX = 200

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function corsHeaders(origin: string | null) {
  const o = origin || '*'
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function jsonResponse(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  })
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders('*') })
}

export async function onRequestGet(context: { request: Request; env: { DB: D1Database } }) {
  const { request, env } = context
  const origin = request.headers.get('Origin')
  const url = new URL(request.url)
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10))

  try {
    const stmt = env.DB.prepare(
      'SELECT id, author, message, created_at FROM guestbook WHERE deleted = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?'
    )
    const { results } = await stmt.bind(limit, offset).all()
    return jsonResponse({ data: results }, 200, origin)
  } catch (e) {
    console.error('guestbook GET', e)
    return jsonResponse({ error: '조회 실패', data: [] }, 500, origin)
  }
}

export async function onRequestPost(context: { request: Request; env: { DB: D1Database } }) {
  const { request, env } = context
  const origin = request.headers.get('Origin')
  let body: { author?: string; password?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: '잘못된 요청' }, 400, origin)
  }
  const author = String(body.author ?? '').trim().slice(0, AUTHOR_MAX)
  const password = String(body.password ?? '')
  const message = String(body.message ?? '').trim().slice(0, MESSAGE_MAX)
  if (!author) return jsonResponse({ ok: false, error: '작성자를 입력해 주세요.' }, 400, origin)
  if (!message) return jsonResponse({ ok: false, error: '메시지를 입력해 주세요.' }, 400, origin)
  if (!password) return jsonResponse({ ok: false, error: '비밀번호를 입력해 주세요.' }, 400, origin)

  try {
    const password_hash = await sha256Hex(password)
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO guestbook (id, author, password_hash, message) VALUES (?, ?, ?, ?)'
    )
      .bind(id, author, password_hash, message)
      .run()
    return jsonResponse({ ok: true }, 201, origin)
  } catch (e) {
    console.error('guestbook POST', e)
    return jsonResponse({ ok: false, error: '등록에 실패했습니다.' }, 500, origin)
  }
}

export async function onRequestDelete(context: { request: Request; env: { DB: D1Database } }) {
  const { request, env } = context
  const origin = request.headers.get('Origin')
  let body: { id?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: '잘못된 요청' }, 400, origin)
  }
  const id = String(body.id ?? '').trim()
  const password = String(body.password ?? '')
  if (!id || !password) return jsonResponse({ ok: false, error: 'id와 비밀번호가 필요합니다.' }, 400, origin)

  try {
    const row = await env.DB.prepare(
      'SELECT password_hash FROM guestbook WHERE id = ? AND deleted = 0'
    )
      .bind(id)
      .first<{ password_hash: string }>()
    if (!row) return jsonResponse({ ok: false, error: '메시지를 찾을 수 없습니다.' }, 404, origin)
    const inputHash = await sha256Hex(password)
    if (row.password_hash !== inputHash) {
      return jsonResponse({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, 400, origin)
    }
    await env.DB.prepare('UPDATE guestbook SET deleted = 1 WHERE id = ?').bind(id).run()
    return jsonResponse({ ok: true }, 200, origin)
  } catch (e) {
    console.error('guestbook DELETE', e)
    return jsonResponse({ ok: false, error: '삭제에 실패했습니다.' }, 500, origin)
  }
}
