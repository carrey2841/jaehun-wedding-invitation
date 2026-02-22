-- Cloudflare D1 방명록 테이블 (SQLite)
-- 아래 "Cloudflare에서 할 설정" 2단계에서 실행

CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  message TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_guestbook_deleted_created ON guestbook(deleted, created_at);
