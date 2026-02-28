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

**부모님용 공유 이미지:** 아래 둘 중 편한 방식으로 사용하면, 카카오톡 공유하기 버튼으로 보낼 때 **다른 이미지**가 피드에 노출됩니다. `public/cover-parent.jpeg`에 부모님용 사진을 넣어 두세요.
- **Path:** `https://도메인/parent` (추천)
- **Query:** `https://도메인/?cover=parent`
(이미지 URL이 달라서 카카오 캐시와도 별도로 동작합니다.)

**카카오 피드 이미지 규격:** 피드는 이미지를 **정사각형(1:1)** 으로 잘라서 보여줍니다. 그래서 세로/가로로 긴 사진은 잘릴 수 있어요. 이 프로젝트는 `pnpm run optimize:gallery` 시 **피드 전용 800×800 정사각형**을 따로 만들어서 (`cover-feed.jpeg`, `cover-parent-feed.jpeg`) 공유 시 그걸 쓰므로, 잘림 없이 나오도록 되어 있습니다.

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
