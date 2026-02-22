/**
 * 방명록 API (Cloudflare D1 + Pages Functions)
 * GET/POST/DELETE /api/guestbook
 */

const KST = 'Asia/Seoul'

/** API에서 내려오는 created_at(UTC)을 KST 기준으로 포맷 */
export function formatGuestbookDateKST(
  iso: string,
  options: { withYear?: boolean } = {}
): string {
  try {
    let s = iso.trim()
    if (!/Z|[+-]\d{2}:?\d{2}$/.test(s)) s = s.replace(' ', 'T') + 'Z'
    const d = new Date(s)
    return d.toLocaleDateString('ko-KR', {
      timeZone: KST,
      year: options.withYear ? 'numeric' : undefined,
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export type GuestbookRow = {
  id: string
  author: string
  message: string
  created_at: string
}

const PAGE_SIZE = 10
const API = '/api/guestbook'

export async function fetchGuestbookList(limit: number, offset = 0): Promise<GuestbookRow[]> {
  try {
    const res = await fetch(`${API}?limit=${limit}&offset=${offset}`)
    const json = await res.json()
    if (!res.ok) return []
    return Array.isArray(json.data) ? json.data : []
  } catch (e) {
    console.error('guestbook fetch', e)
    return []
  }
}

export async function insertGuestbook(
  author: string,
  password: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: author.slice(0, 10),
        password,
        message: message.slice(0, 200),
      }),
    })
    const json = await res.json()
    if (res.ok && json.ok) return { ok: true }
    return { ok: false, error: json.error ?? '등록에 실패했습니다.' }
  } catch (e) {
    console.error('guestbook insert', e)
    return { ok: false, error: '등록에 실패했습니다.' }
  }
}

export async function softDeleteGuestbook(
  id: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    })
    const json = await res.json()
    if (res.ok && json.ok) return { ok: true }
    return { ok: false, error: json.error ?? '삭제에 실패했습니다.' }
  } catch (e) {
    console.error('guestbook delete', e)
    return { ok: false, error: '삭제에 실패했습니다.' }
  }
}

export { PAGE_SIZE }
