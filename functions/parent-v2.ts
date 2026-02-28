/**
 * /parent-v2, /parent-v2/ 요청 시 parent.html 내용을 그대로 반환 (OG용, URL 변경 없음).
 * _redirects 200 rewrite가 Cloudflare Pages에서 동작하지 않아 Function으로 처리.
 */
interface Env {
  ASSETS: Fetcher
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context
  const parentUrl = new URL('/parent.html', request.url).href
  const res = await env.ASSETS.fetch(new Request(parentUrl))
  if (res.status === 404) {
    return new Response('Not Found', { status: 404 })
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
}
