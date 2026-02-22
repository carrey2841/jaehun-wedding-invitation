# GitHub → Cloudflare Pages 배포 구조

청첩장 프로젝트의 배포 흐름과 설정을 정리한 문서입니다.

---

## 1. 배포 구조 개요

```
GitHub (main 브랜치 push)
    ↓
Cloudflare Pages (Git 연결된 프로젝트)
    ↓  Build: pnpm install → pnpm run build
    ↓  Deploy: wrangler pages deploy dist
    ↓
Cloudflare Pages (실제 서비스 프로젝트: jaehun-wedding-invitation)
    ↓  Custom domain 연결 가능
    ↓
https://도메인 또는 https://jaehun-wedding-invitation.pages.dev
```

- **빌드·배포**: Cloudflare가 GitHub 저장소를 연결해 push 시 자동으로 빌드 후, `wrangler pages deploy`로 **Pages 프로젝트**에 업로드합니다.
- **서비스**: `jaehun-wedding-invitation` 이라는 **Pages** 프로젝트 하나가 실제 청첩장 사이트를 서빙합니다.

---

## 2. Cloudflare에서 필요한 것

### 2-1. Pages 프로젝트 (실제 서비스용)

- **종류**: Pages → **Direct Upload** 로 만든 프로젝트
- **프로젝트 이름**: `jaehun-wedding-invitation` (배포 명령의 `--project-name` 과 동일해야 함)
- **용도**: 빌드 결과물(`dist`)이 여기로 배포됨. Workers가 아님.

> ⚠️ **Workers vs Pages**  
> URL이 `.../workers/services/view/...` 인 건 **Workers** 프로젝트입니다.  
> `wrangler pages deploy` 는 **Pages** 프로젝트만 대상으로 하므로, 반드시 **Pages** 로 생성한 프로젝트를 사용해야 합니다.

### 2-2. Git 연결된 빌드 프로젝트 (선택)

- GitHub 저장소를 연결한 **또 다른** Pages 프로젝트에서 빌드 + Deploy command 로 위 프로젝트에 배포하는 방식일 수 있음.
- 이 경우 해당 프로젝트의 **Build settings** 와 **Deploy command** 만 아래와 같이 맞추면 됨.

---

## 3. Cloudflare Build / Deploy 설정

### Build settings (Git 연결 프로젝트에서 빌드하는 경우)

| 항목 | 값 |
|------|-----|
| **Build command** | `pnpm install && pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (비움) |

### Deploy command

```bash
pnpm exec wrangler pages deploy dist --project-name=jaehun-wedding-invitation
```

- `dist`: Vite 빌드 결과 폴더
- `--project-name=jaehun-wedding-invitation`: 배포 대상 **Pages** 프로젝트 이름 (반드시 동일하게)

### 프로젝트에 wrangler 포함

- `package.json` 의 `devDependencies` 에 `wrangler` 가 있어야 Deploy command 의 `pnpm exec wrangler` 가 동작합니다.
- 없으면: `pnpm add -D wrangler` 후 커밋/푸시.

---

## 4. API 토큰 (인증)

Deploy command 가 Cloudflare API를 쓰려면 **API 토큰**이 필요합니다.

### 토큰 생성

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → **Edit Cloudflare Workers** 템플릿 또는 Custom token
3. **Permissions**: **Account** → **Cloudflare Pages** → **Edit**
4. 생성 후 토큰 값 복사 (한 번만 표시)

### 토큰 넣는 곳

- **Cloudflare Git 연결 프로젝트**에서 배포하는 경우:  
  해당 Pages 프로젝트 → **Settings** → **Environment variables**  
  - Name: `CLOUDFLARE_API_TOKEN`  
  - Value: 위에서 만든 토큰
- **GitHub Actions** 로 배포하는 경우:  
  GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**  
  - `CLOUDFLARE_API_TOKEN`  
  - `CLOUDFLARE_ACCOUNT_ID` (대시보드에서 확인)

---

## 5. GitHub Actions (대안)

Cloudflare Git 연결 대신 **GitHub Actions** 로만 배포할 수도 있습니다.

- 워크플로: `.github/workflows/deploy.yml`
- 동작: `main` push 시 `pnpm install` → `pnpm run build` → `wrangler pages deploy dist --project-name=jaehun-wedding-invitation`
- 필요한 Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- 이 경우 Cloudflare에는 **Pages Direct Upload 프로젝트**(`jaehun-wedding-invitation`) 하나만 있으면 됨.

---

## 6. 커스텀 도메인

- Pages 프로젝트 → **Custom domains** → **Set up a custom domain**
- Cloudflare에 도메인 연결/이전은 **선택**:  
  - **DNS Transfer**: DNS를 Cloudflare로 옮겨서 관리 (무료).  
  - **Transfer 안 함**: 현재 DNS 관리하는 곳에서 CNAME 등만 추가해도 됨.
- Pages 도메인 연결 자체는 **추가 비용 없음**. 도메인 등록/연장 비용만 있음.

---

## 7. 체크리스트 (나중에 까먹었을 때)

- [ ] Cloudflare **Pages** 프로젝트 `jaehun-wedding-invitation` 존재 여부
- [ ] Deploy command: `pnpm exec wrangler pages deploy dist --project-name=jaehun-wedding-invitation`
- [ ] `package.json` 에 `wrangler` in devDependencies
- [ ] `CLOUDFLARE_API_TOKEN` (Pages Edit 권한) 설정 여부
- [ ] Build output directory = `dist`
- [ ] Workers가 아니라 **Pages** 프로젝트인지 확인

---

## 8. 참고 링크

- [Cloudflare Pages - Direct Upload (CI)](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
