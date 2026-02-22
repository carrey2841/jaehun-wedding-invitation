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
