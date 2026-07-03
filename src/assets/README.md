# Source Assets Directory

Paste component-bound or bundled assets (such as icons, logos, illustrations) into this folder.

## How to Import in React/Next.js Components

```tsx
import myLogo from "@/assets/logo.png";

export default function MyComponent() {
  return <img src={myLogo.src} alt="Logo" />;
}
```

> **Tip**: For large background images or promotional videos, pasting them inside `public/assets/` is generally recommended for optimal Next.js caching and streaming.
