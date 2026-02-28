# React + TypeScript + Vite (모바일 청첩장)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### 이미지 최적화 (갤러리 + cover + invitation)

`public/gallery`, `public/cover.*`, `public/invitation.*` 이미지를 리사이즈·압축합니다. `pnpm dev` / `pnpm run build` 시 자동 실행됩니다.

```bash
pnpm add -D sharp   # 최초 1회
pnpm run optimize:gallery              # gallery-optimized/, cover-optimized.jpg, invitation-optimized.jpg 생성
pnpm run optimize:gallery -- --replace  # gallery 만 원본 백업 후 최적화본으로 교체
```

- **대상**: `public/cover.jpeg`(또는 .png 등), `public/invitation.jpg`(또는 .png), `public/gallery/*`
- **기준**: 긴 변 최대 1200px, JPEG 품질 82
- **배포**: 빌드 시 dist 에 최적화본만 포함됨

### 방명록 (Cloudflare D1)

방명록은 **Cloudflare D1** + **Pages Functions**를 사용합니다. DB/API 모두 Cloudflare에서 무료로 사용할 수 있습니다.

- **설정 방법**: [docs/CLOUDFLARE-D1-SETUP.md](docs/CLOUDFLARE-D1-SETUP.md) 참고 (D1 생성 → 스키마 실행 → Pages에 D1 바인딩 → 배포)
- **기능**: 축하 메시지 등록(작성자 10자, 비밀번호, 메시지 200자), 최신 5개 + 더보기(10개씩), 비밀번호 확인 후 soft delete

### 카카오톡 공유 (피드 + 버튼)

공유 시 커버 이미지와 **「모바일 청첩장 보기」** 버튼이 나오려면, 카카오 개발자 콘솔에서 **두 곳**을 모두 설정해야 합니다.

1. **플랫폼 키 → JavaScript 키**  
   - JavaScript 키 복사 → `.env`에 `VITE_KAKAO_JAVASCRIPT_KEY=키`  
   - **JavaScript SDK 도메인**에 사이트 주소 등록 (예: `https://your-site.pages.dev`, 로컬 테스트 시 `http://localhost:5173` 추가)

2. **제품 링크 관리 → 웹 도메인** (버튼 노출 필수)  
   - [앱 관리 페이지](https://developers.kakao.com/console/app) → 앱 선택 → **앱** → **제품 링크 관리**  
   - **웹 도메인** → **도메인 등록** → 청첩장 배포 주소 입력 (예: `https://your-site.pages.dev`, 끝에 `/` 없이)  
   - 저장 후 **기본 도메인**으로 선택해 두면 됨  

제품 링크 관리에 웹 도메인이 없으면 피드는 보여도 **버튼이 아예 노출되지 않습니다.** 링크 주소의 도메인은 반드시 여기 등록된 값과 같아야 합니다.

**커버 이미지 3종과 OG/카카오 공유 규칙**

| 파일 | 용도 |
|------|------|
| `cover.jpeg` | 기본 커버 이미지. 카카오톡 공유 시(기본 경로)에도 이 이미지 사용. OG도 `/` 공유 시 이 이미지. |
| `cover-parent.jpeg` | `/parent` 로 들어왔을 때 Cover 섹션에 보이는 이미지. |
| `cover-parent-feed.jpeg` | `/parent` 페이지에서 카카오톡 공유 시 피드 이미지. 링크 공유 시 OG 미리보기에도 이 이미지. |

- **OG:** `/` 공유 시 → `og:image` = `cover.jpeg`. `/parent` 공유 시 → `og:image` = `cover-parent-feed.jpeg` (빌드 시 `parent.html` 생성 + `_redirects`로 처리).
- **카카오 피드:** 기본 경로 공유 → `cover.jpeg`. `/parent`(또는 `?cover=parent`)에서 공유 → `cover-parent-feed.jpeg`.
- 배포 시 **`VITE_SITE_URL`** 을 반드시 설정해야 OG/피드 이미지가 절대 URL로 들어가서 미리보기가 나옵니다.

**부모님용 경로:** `https://도메인/parent` (추천) 또는 `https://도메인/?cover=parent`. `public/cover-parent.jpeg`(Cover 표시용), `public/cover-parent-feed.jpeg`(공유 미리보기용)를 준비하세요.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
