# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
## Draft Persistence (Autosave) for Create Pages

- Purpose: Keep unsaved form data if you navigate away or close the tab, and restore it when you come back to the same create page.

- Utilities: See `src/utils/draft.ts` which provides `useDraftState`, `saveDraft`, `loadDraft`, and `clearDraft`.

- Recommended usage (drop-in for `useState`):

```tsx
import { useDraftState } from "../utils/draft"; // adjust path per file

// Inside a Create page component
export default function BlogCreate() {
  // Choose a unique key per page/form. Route + entity works well.
  const DRAFT_KEY = "create:blog"; // e.g., include userId if multi-user

  const [form, setForm, draft] = useDraftState(DRAFT_KEY, {
    title: "",
    slug: "",
    body: "",
    tags: [],
    coverUrl: "",
  });

  const onChange = (field: keyof typeof form, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const onSubmit = async () => {
    // call API with `form`
    // await api.blogs.create(form);
    // Clear draft after successful submit so the page starts fresh next time
    draft.clear();
  };

  return (
    <div>
      {/* bind inputs to `form` and update via `onChange` */}
    </div>
  );
}
```

- Keying strategy:
  - Use a stable, unique key per form, e.g., `create:destination`, `create:guide`, etc.
  - If drafts should be separate per user, include user id: `create:blog:user:123`.

- Clearing behavior:
  - Call `draft.clear()` after a successful submit.
  - Optionally call on explicit "Discard draft" button.

- Notes:
  - Data is stored in `localStorage` only on the client.
  - Restores automatically when the component mounts using the same key.
