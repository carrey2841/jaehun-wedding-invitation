# Cloudflare에서 할 설정 (방명록 D1)

방명록은 **Cloudflare D1** + **Pages Functions**로 동작합니다. 아래 순서대로 하면 됩니다.

---

## 1. D1 데이터베이스 만들기

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 로그인
2. 왼쪽 메뉴에서 **Workers & Pages** 클릭
3. 상단 탭에서 **D1 SQL Database** 선택
4. **Create database** 클릭
5. **Database name**에 `guestbook-db` (또는 원하는 이름) 입력 → **Create** 클릭
6. 생성된 DB 행에서 **Database ID** 복사해 두기 (나중에 바인딩에 사용)

---

## 2. 테이블 생성 (스키마 실행)

1. 방금 만든 DB 이름 클릭해서 들어가기
2. **Console** 탭 선택
3. 아래 SQL 전체 복사해서 붙여넣고 **Execute** 실행

```sql
CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  message TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_guestbook_deleted_created ON guestbook(deleted, created_at);
```

(같은 내용이 프로젝트의 `cloudflare/d1-schema.sql` 파일에도 있습니다.)

---

## 3. Pages 프로젝트에 D1 연결 (바인딩)

1. 왼쪽 메뉴 **Workers & Pages** → **Pages**로 이동
2. 이 청첩장 사이트의 **Pages 프로젝트** 선택 (없으면 먼저 저장소 연결 후 배포 한 번 해 둠)
3. **Settings** 탭 클릭
4. 왼쪽에서 **Functions** 선택
5. 아래로 내려가 **D1 database bindings** 섹션 찾기
6. **Add binding** 클릭
   - **Variable name**: `DB` (코드에서 이 이름으로 씀, 반드시 대문자 DB)
   - **D1 database**: 위에서 만든 `guestbook-db` 선택
7. **Save** 클릭

---

## 4. 다시 배포

바인딩을 추가·수정한 뒤에는 **한 번 더 배포**해야 적용됩니다.

- **Git 연결 배포**: 저장소에 커밋 & 푸시하면 자동 배포
- **직접 업로드**: `pnpm run build` 후 `dist` 폴더와 `functions` 폴더가 함께 배포되도록 설정되어 있어야 함 (Cloudflare Pages는 루트에 `functions` 폴더가 있으면 자동으로 Functions로 인식)

---

## 5. 확인

배포가 끝나면 청첩장 사이트에서:

- **축하 메시지 남기기**로 글 작성 → 목록에 보이면 등록 성공
- **×** 버튼으로 비밀번호 입력 후 삭제 → 목록에서 사라지면 삭제(soft delete) 성공

---

## 요약

| 단계 | 할 일 |
|------|--------|
| 1 | D1에서 `guestbook-db` 생성, Database ID 복사 |
| 2 | D1 Console에서 `cloudflare/d1-schema.sql` 내용 실행 |
| 3 | Pages 프로젝트 Settings → Functions → D1 binding 추가 (변수명 `DB`, DB 선택) |
| 4 | 저장 후 다시 배포 |

이렇게 하면 Cloudflare만으로 방명록이 동작하고, **별도 DB 비용 없이** 무료 한도 안에서 사용할 수 있습니다.
