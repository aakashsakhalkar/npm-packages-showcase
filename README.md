# ⚡ Open Source NPM Library Suite & Interactive Studio

> A showcase and interactive playground for 5 zero-dependency, production-ready TypeScript libraries authored by **[Aakash Sakhalkar](https://aakash-sakhalkar.web.app/)**.

[![NPM Suite](https://img.shields.io/badge/NPM-5%20Zero--Dependency%20Libraries-cb3837?logo=npm&logoColor=white)](https://www.npmjs.com/~aakash.sakhalkar)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Portfolio](https://img.shields.io/badge/Portfolio-aakash--sakhalkar-0284c7?logo=googlechrome&logoColor=white)](https://aakash-sakhalkar.web.app/)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify-00ad9f?logo=netlify&logoColor=white)](https://app.netlify.com/)

---

## 📦 Single-Line Installation (All 5 Packages)

```bash
npm install aescryptor-ts marathi-panchang-core web-color-extractor indic-number-words base64-toolkit
```

---

## 🏛️ Featured Libraries Overview

| # | Package | Version | Description | External Deps |
|---|---------|---------|-------------|---------------|
| 1 | [`aescryptor-ts`](#1-aescryptor-ts) | `v1.0.0` | Zero-dependency AES-256-GCM encryption/decryption with PBKDF2 & tamper protection. | **0** |
| 2 | [`marathi-panchang-core`](#2-marathi-panchang-core) | `v1.0.4` | Ultra-accurate Marathi Panchang and Hindu Calendar astronomical engine. | **0** |
| 3 | [`web-color-extractor`](#3-web-color-extractor) | `v1.0.0` | Client-side dynamic color palette extractor using HTML5 Canvas & MMCQ. | **0** |
| 4 | [`indic-number-words`](#4-indic-number-words) | `v1.0.1` | Number to Indian format, words, currency, fractions & native digits across 18 Indic languages. | **0** |
| 5 | [`base64-toolkit`](#5-base64-toolkit) | `v1.0.0` | Ultra-fast Base64 codec, magic-byte format detection (30+ formats) & Base64URL. | **0** |

---

## 1. `aescryptor-ts`

**Zero-dependency, production-ready AES-256-GCM encryption and decryption library for Web Browsers, Node.js, and TypeScript.**

### Key Features
- **AES-256-GCM Authenticated Encryption**: 128-bit authentication tag verification ensures data integrity.
- **PBKDF2 Key Derivation**: SHA-256 with customizable iteration counts (e.g. 100,000 rounds) and cryptographically secure random salts.
- **Object & Class Support**: Dedicated helper methods for strings, JSON objects, and class instances.
- **Tamper Resistant**: Any tampering with ciphertext or auth tag immediately throws a `DecryptionError`.
- **Self-Contained Payload**: Encodes version, salt, IV, ciphertext, and auth tag into a portable string format (`$aescryptor$v1$...`).

### Installation
```bash
npm install aescryptor-ts
```

### Usage Example
```typescript
import { AesCryptor } from 'aescryptor-ts';

const secretKey = 'my-super-secret-passphrase';

// 1. Text Encryption
const encrypted = await AesCryptor.encrypt('Confidential Financial Report', secretKey, {
  iterations: 100000,
  format: 'base64', // 'base64' | 'hex'
  saltLength: 16,
  ivLength: 12
});
console.log('Encrypted Payload:', encrypted);

// 2. Text Decryption
const decrypted = await AesCryptor.decrypt(encrypted, secretKey);
console.log('Decrypted Text:', decrypted);

// 3. Object & JSON Encryption
const userPayload = { userId: 42, role: 'admin', sessionExpires: '2026-12-31' };
const encryptedJson = await AesCryptor.encryptJson(userPayload, secretKey);
const decryptedJson = await AesCryptor.decryptJson<{ userId: number }>(encryptedJson, secretKey);

// 4. Cryptographic Random Key Generation
const random256Key = AesCryptor.generateKey(256); // Returns 256-bit hex/base64 key
```

---

## 2. `marathi-panchang-core`

**Ultra-accurate, zero-dependency Marathi Panchang and Hindu Calendar astronomical engine for Web, Node.js, and Android using Lahiri Ayanamsha & Amanta month system.**

### Key Features
- **Panchang Elements (पंचांग घटक)**: Full computation of Tithi (तिथी), Nakshatra (नक्षत्र with Pada & Ruler), Yoga (योग), Karana (करण with Bhadra / विष्टी alerts), and Samvat (शके १९४८ • पराभव संवत्सर).
- **Amanta Month System (अमांत चांद्र मास)**: Month is calculated from preceding New Moon conjunction (अमावास्या), ensuring zero month-drift errors during solar sign transits (संक्रांती).
- **Solar & Lunar Ephemeris (खगोलीय स्थिती)**: Accurate Sunrise (सूर्योदय), Sunset (सूर्यास्त), Solar Noon, Day Length, and Moonrise (चंद्रोदय — essential for Sankashti Chaturthi fast).
- **Inauspicious & Auspicious Timings**: Rahu Kaal (राहू काळ), Yamaganda, Gulika Kaal, Abhijit Muhurta, and Brahma Muhurta.
- **Festival & Vrat Engine (सण व उत्सव)**: Pre-configured detection for Gudi Padwa, Ashadhi/Kartiki Ekadashi, Ganesh Chaturthi, Rishi Panchami, Gauri Avahan & Pujan, Bail Pola, Navratri, Kojagiri, Diwali, and Sankashti Chaturthi.
- **Universal Multi-Format Export**: Pure ES Module (`dist/index.js`), CommonJS (`dist/index.cjs`), and Browser IIFE Bundle (`dist/marathi-panchang.min.js`).

### Installation
```bash
npm install marathi-panchang-core
```

### Usage Example
```typescript
import { getMarathiPanchang } from 'marathi-panchang-core';

// Calculate for Pune on a specific date
const panchang = getMarathiPanchang('2026-08-19', {
  latitude: 18.5204,
  longitude: 73.8567,
  timezoneOffsetHours: 5.5,
  cityName: 'Pune'
});

console.log('Month:', panchang.month.fullMonthNameMarathi); // 'निज श्रावण'
console.log('Tithi:', panchang.tithi.nameMarathi, panchang.tithi.pakshaMarathi); // 'सप्तमी', 'शुक्ल पक्ष'
console.log('Nakshatra:', panchang.nakshatra.nameMarathi, 'Pada:', panchang.nakshatra.pada);
console.log('Yoga:', panchang.yoga.nameMarathi, 'Auspicious:', panchang.yoga.isAuspicious);
console.log('Sunrise:', panchang.astronomy.sunrise, 'Sunset:', panchang.astronomy.sunset);
console.log('Rahu Kaal:', panchang.muhurta.rahuKaal.start, 'to', panchang.muhurta.rahuKaal.end);
console.log('Festivals:', panchang.festivals.map(f => f.nameMarathi));
```

---

## 3. `web-color-extractor`

**High-performance, zero-dependency client-side dynamic color palette extractor using HTML5 Canvas, MMCQ algorithm, and Web Workers.**

### Key Features
- **Modified Median Cut Quantization (MMCQ)**: High fidelity color quantization for vibrant and balanced palette generation.
- **7 Profile Color Swatches**: Dominant, Vibrant, Light Vibrant, Dark Vibrant, Muted, Light Muted, and Dark Muted.
- **Web Worker Acceleration**: Offloads heavy pixel quantization to background threads without freezing UI rendering.
- **WCAG 2.1 Contrast Validator**: Calculates exact contrast ratios and compliance ratings (`AA`, `AAA`) for accessible text placement.
- **Flexible Inputs**: Accepts image elements, Canvas, Blob, Data URLs, or remote image URLs.

### Installation
```bash
npm install web-color-extractor
```

### Usage Example
```typescript
import { extractPalette, extractDominantColor } from 'web-color-extractor';

const imgElement = document.getElementById('cover-image') as HTMLImageElement;

const palette = await extractPalette(imgElement, {
  maxColors: 10,
  quality: 5,        // 1 (highest precision) to 20 (fastest)
  maxDimension: 400, // Downscale bounding box
  useWorker: true,   // Run in Web Worker
  ignoreWhite: true  // Filter out background whites
});

console.log('Dominant Color:', palette.dominant.hex, palette.dominant.rgb);
console.log('Vibrant:', palette.vibrant?.hex);
console.log('Dark Vibrant:', palette.darkVibrant?.hex);
console.log('Light Vibrant:', palette.lightVibrant?.hex);
console.log('Muted:', palette.muted?.hex);
console.log('All Swatches:', palette.palette.map(c => c.hex));
```

---

## 4. `indic-number-words`

**Convert numbers into Indian format, words, currency, fractions, native script digits, and ordinals across 18 Indic languages including Sanskrit, Marathi, Hindi, Tamil, Bengali, and Gujarati.**

### Key Features
- **18 Indic Languages Supported**: Sanskrit (`sa`), Marathi (`mr`), Hindi (`hi`), English (`en`), Gujarati (`gu`), Bengali (`bn`), Tamil (`ta`), Telugu (`te`), Kannada (`kn`), Malayalam (`ml`), Punjabi (`pa`), Odia (`or`), Assamese (`as`), Urdu (`ur`), Kashmiri (`ks`), Konkani (`kok`), Maithili (`mai`), Sindhi (`sd`).
- **7 Formatting Methods**:
  1. `formatIndic(number)`: Standard Indian numbering system grouping (e.g. `12,50,000`).
  2. `toWords(number, { lang })`: Grammatically accurate spoken words.
  3. `toCurrency(number, { lang })`: Legal and financial cheque phrasing (e.g. `Twelve Lakh Fifty Thousand Rupees Only`).
  4. `toCompact(number, { lang })`: Short notation (e.g. `12.5L`, `1.2Cr`).
  5. `toNativeDigits(number, { lang })`: Translates numbers into native script digits (`१२,५०,०००`).
  6. `toFraction(number, { lang })`: Traditional Indian fractional wording (`पाव`, `अर्धा`, `पाऊण`, `सव्वा`, `दीड`, `अडीच`, `साडे`).
  7. `toOrdinal(number, { lang })`: Ordinal ranking (`पहिला`, `दुसरा`, `1st`, `2nd`).

### Installation
```bash
npm install indic-number-words
```

### Usage Example
```typescript
import { 
  formatIndic, 
  toWords, 
  toCurrency, 
  toCompact, 
  toNativeDigits, 
  toFraction, 
  toOrdinal 
} from 'indic-number-words';

const val = 1250000.75;

console.log('Indian Format:', formatIndic(val)); // "12,50,000.75"
console.log('Hindi Words:', toWords(val, { lang: 'hi' })); // "बारह लाख पचास हज़ार दशमलव सात पाँच"
console.log('Marathi Currency:', toCurrency(val, { lang: 'mr' })); // "बारा लाख पन्नास हजार रुपये आणि पंच्याहत्तर पैसे फक्त"
console.log('Compact:', toCompact(val, { lang: 'mr' })); // "12.5 लाख"
console.log('Devanagari Digits:', toNativeDigits(val, { lang: 'mr' })); // "१२,५०,०००.७५"
console.log('Indian Fraction (1.5):', toFraction(1.5, { lang: 'mr' })); // "दीड"
console.log('Ordinal (1st):', toOrdinal(1, { lang: 'mr' })); // "पहिला"
```

---

## 5. `base64-toolkit`

**Ultra-fast, zero-dependency Base64 encoder/decoder, magic-byte binary format inspector (30+ file formats), Data URL parser, and RFC 4648 §5 Base64URL converter.**

### Key Features
- **Universal Codec**: Full support for standard ASCII, UTF-8 strings, Unicode symbols, and emojis.
- **Magic Byte File Inspection (`inspect()`)**: Detects 30+ file types directly from Base64 or binary data (PNG, JPEG, WebP, GIF, PDF, ZIP, MP3, MP4, WASM, GZIP, TAR, TIFF, etc.).
- **RFC 4648 §5 Base64URL**: URL and filename safe conversion (`+` -> `-`, `/` -> `_`, padding removal).
- **Data URL Utilities**: Seamlessly parse and construct RFC 2397 Data URLs (`data:image/png;base64,...`).
- **Validation**: Strict RFC 4648 compliance verification and error reporting.

### Installation
```bash
npm install base64-toolkit
```

### Usage Example
```typescript
import { 
  encode, 
  decode, 
  inspect, 
  toDataUrl, 
  fromDataUrl, 
  toBase64Url, 
  fromBase64Url, 
  isValid 
} from 'base64-toolkit';

// 1. Unicode & Emoji Encoding
const encoded = encode('Hello World 🚀✨');
const decoded = decode(encoded);

// 2. Magic Byte Inspection (Detects MIME, Extension & Format)
const report = inspect('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
console.log('MIME Type:', report.mimeType);             // "image/png"
console.log('Extension:', report.extension);           // "png"
console.log('Format:', report.formatDescription);       // "PNG Image (Portable Network Graphics)"
console.log('Magic Bytes:', report.magicBytes);         // "89 50 4E 47 0D 0A 1A 0A"
console.log('Decoded Size:', report.estimatedDecodedSize); // 68 bytes

// 3. RFC 4648 §5 Base64URL
const urlSafe = toBase64Url(encoded);
const standard = fromBase64Url(urlSafe);

// 4. Data URL Utilities
const dataUrl = toDataUrl(encoded, 'image/png');
const parsed = fromDataUrl(dataUrl);
console.log('MIME:', parsed.mimeType, 'Data:', parsed.base64);
```

---

## 🛠️ Interactive Studio Application

This repository contains a full-featured, responsive **Vite + React + TypeScript** web application providing an interactive studio for each package:

- **Suite Overview Hub**: Summary metrics, single-line install snippets, quick jump cards, and developer profile.
- **AES-256-GCM Live Studio**: Interactive encryption playground, secret key generator, PBKDF2 iterations slider, and live tamper simulation.
- **Panchang Vedic Studio**: Date picker, 9 city presets, coordinates configuration, bilingual Marathi/English toggle, and celestial ephemeris tracking.
- **Color Extractor Studio**: Canvas image uploader, MMCQ palette generator, dynamic themed music player mock UI, and WCAG 2.1 accessibility checker.
- **Indic Numbers Studio**: Live translation across all 18 Indic dialects, spoken audio pronunciation via Web Speech API, and 18-language side-by-side comparison table.
- **Base64 Toolkit Studio**: Unicode encoder/decoder, magic-byte binary inspector for 30+ file types, Data URL previewer, and streaming chunk simulator.
- **Light & Dark Themes**: High-contrast, clean default Light mode with one-click theme switcher.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/aakash-sakhalkar/npm-packages-showcase.git
cd npm-packages-showcase

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Build for Production
```bash
npm run build
```

The compiled bundle will be in the `dist/` directory.

---

## 🌐 Deployment Guide

### Deploy to Netlify

#### Method A: Automatic Deploy via Git (Recommended)
1. Push your repository to GitHub.
2. In [Netlify Dashboard](https://app.netlify.com/), click **"Add new site"** > **"Import an existing project"**.
3. Select your repository. Netlify will use settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Click **"Deploy site"**.

#### Method B: Manual CLI Deploy
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

---

## 📝 Recent Updates & Changelog

### 📅 August 19, 2026

#### 🐛 Bug Fixes & Astronomical Alignment
- **`marathi-panchang-core v1.0.4` Upgrade & Amanta Month Fix**:
  - Upgraded to `marathi-panchang-core v1.0.4` across `package.json`, `packagesInfo.ts`, and `PanchangStudio.tsx`.
  - Resolved lunar month calculation bug where current-day solar transit mistakenly shifted mid-August to Bhadrapada; the engine now strictly follows authentic Amanta Siddhanta (conjunction at preceding New Moon / Amavasya).
  - Aligned Maharashtrian festival dates (Pithori Amavasya / Pola on Sep 11, Ganesh Chaturthi on Sep 14, Rishi Panchami on Sep 15, and Jyeshtha Gauri Pujan on Sep 18, 2026).
- **ESM Module Resolution for Vite**:
  - Resolved `Uncaught SyntaxError: The requested module does not provide an export named 'getMarathiPanchang'` by generating native ES Module exports (`dist/index.js`) and dual CJS/ESM packaging in `marathi-panchang-core`.
- **Client Error Boundary (`ErrorBoundary.tsx`)**:
  - Implemented `<ErrorBoundary />` wrapper around active studios to catch uncaught component exceptions and display informative diagnostic stacks instead of blank white screens.
- **Light Mode Text Contrast & Readability**:
  - Resolved low-contrast and unreadable text in Light Mode across all 5 interactive studios.
  - Updated Marathi festival badges (`सण व उत्सव`) to deep, vibrant `#be185d` with clean borders for high WCAG readability.
  - Enhanced contrast on RFC 4648 validation alerts in `base64-toolkit` (`#047857` valid / `#b91c1c` invalid).

#### 🚀 UI & Design Enhancements
- **Ultra-Sleek Modern Custom Scrollbars**:
  - Redesigned the harsh default scrollbars into a modern 7px rounded capsule with an ambient indigo-to-cyan linear gradient thumb and soft translucent track.
  - Added hover illumination effects and cross-browser support (WebKit & Firefox).
  - Refined horizontal navigation bar padding in `TabNav.tsx` for clean, unconstrained scrolling.
- **Interactive Festival Presets**:
  - Added quick-jump presets for Bail Pola, Rishi Panchami, and Gauri Pujan 2026 directly into `PanchangStudio.tsx`.

---

### 📅 August 18, 2026

#### ✨ New Features
- **Custom Brand Identity & Favicon**:
  - Designed custom 3D isometric NPM package cube vector design (`public/favicon.svg`) with glassmorphic squircle tile, neon facet gradients, code brackets, and accent sparkles.
  - Linked SVG favicon and configured browser `theme-color` in `index.html`.
  - Converted and generated high-resolution PNG raster assets (`public/favicon.png`, `public/logo.png`).
- **Reusable Logo Component**:
  - Built `<Logo />` React vector component in `src/components/Logo.tsx` with customizable sizing and interactive hover micro-animations.
  - Integrated brand logo into the sticky Header navigation and Footer.
- **Production Build & CI/CD Pipeline**:
  - Configured `netlify.toml` for Single Page Application (SPA) routing and zero-config automated builds.

---

## 👨‍💻 Author & Maintainer

**Aakash Sakhalkar**
- 🌐 **Portfolio**: [https://aakash-sakhalkar.web.app/](https://aakash-sakhalkar.web.app/)
- 📦 **NPM Profile**: [https://www.npmjs.com/~aakash.sakhalkar](https://www.npmjs.com/~aakash.sakhalkar)
- 💻 **GitHub**: [https://github.com/aakashsakhalkar](https://github.com/aakashsakhalkar)

---

## 📄 License

This project and all associated libraries are released under the [MIT License](LICENSE).
