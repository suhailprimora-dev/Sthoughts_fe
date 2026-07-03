# Public Assets Directory

Paste your static **images** (`.png`, `.jpg`, `.svg`, `.webp`) and **videos** (`.mp4`, `.webm`) into this directory or subdirectories (`public/assets/images` and `public/assets/videos`).

## Usage in Next.js

Since files inside `public/` are served from the root URL `/`, any file placed in `public/assets/` can be accessed directly in your components:

### For Images:
```tsx
import Image from 'next/image';

<img src="/assets/hero-bg.jpg" alt="Hero background" className="w-full h-auto" />
// or using Next.js Image component:
<Image src="/assets/logo.png" width={200} height={80} alt="Logo" />
```

### For Videos:
```tsx
<video autoPlay loop muted playsInline className="w-full h-full object-cover">
  <source src="/assets/promo-video.mp4" type="video/mp4" />
</video>
```
