# ScolioCheck AI

**AI-assisted scoliosis screening from smartphone images.**

A non-diagnostic demo prototype built for a YC application. ScolioCheck AI helps teenagers and parents understand whether visible posture asymmetry may need medical evaluation — from a single back-facing smartphone photo.

---

## ⚠ Important Safety Notice

This is a **demo prototype only**. It does **not** diagnose scoliosis. All analysis results are simulated and are not clinical measurements. Do not use this for any medical decision.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

Requires Node.js 18+ and npm.

---

## Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Framework    | Next.js 14 (App Router)                      |
| Language     | TypeScript                                   |
| Styling      | Tailwind CSS + custom design system          |
| Fonts        | Syne (display) + Figtree (body) via Google Fonts |
| Pose overlay | Canvas 2D API (animated, resolution-independent) |
| State        | React Context + sessionStorage persistence   |
| Hosting      | Vercel-ready                                 |

No paid APIs. No external dependencies beyond Next.js + React + Tailwind.

---

## User Flow

```
/ (Landing)
  → /screen  (Guided capture + image upload)
    → /analysis  (Loading + animated canvas overlay)
      → /results  (Full report card + next steps)
```

All image processing runs **entirely in the browser**. No image data is transmitted anywhere.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page (hero, features, YC demo section)
│   ├── screen/page.tsx   # Guided capture + image upload
│   ├── analysis/page.tsx # Loading animation + canvas overlay
│   ├── results/page.tsx  # Report card + next steps + copy/print
│   ├── layout.tsx        # Root layout with ScreeningProvider
│   └── globals.css       # Design tokens + Tailwind base
├── components/
│   ├── PostureCanvas.tsx  # Canvas-based animated landmark overlay
│   └── ReportCard.tsx     # Printable screening report
├── context/
│   └── ScreeningContext.tsx  # Cross-page state (image + results)
└── lib/
    ├── types.ts           # Shared TypeScript types
    ├── analysis.ts        # Demo analysis engine + copy strings
    └── sampleImage.ts     # Inline SVG demo silhouette
```

---

## Production AI Integration

The analysis engine in `src/lib/analysis.ts` is a demo simulation. To integrate a real pose detection model, replace `runAnalysis()` with one of:

### Option A: MediaPipe Pose (browser, free, private)
```ts
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
// Runs on-device via WebAssembly — no server required
// Returns 33 body landmarks at 0-1 normalised coordinates
```

### Option B: TensorFlow.js MoveNet (browser, free)
```ts
import * as poseDetection from '@tensorflow-models/pose-detection';
// model: poseDetection.SupportedModels.MoveNet
// Returns 17 COCO keypoints
```

### Option C: Server-side CV endpoint
```ts
// POST /api/analyze with image → returns { landmarks, confidence }
// Suitable for higher accuracy models (MediaPipe on server, custom CNN)
```

The `Landmarks` type in `src/lib/types.ts` uses 0–1 fractions of image size, making it model-agnostic. Swap the model without touching the overlay rendering.

---

## Deploying to Vercel

```bash
npx vercel --prod
```

No environment variables required for the demo.

---

## Design System

| Token          | Value       |
|----------------|-------------|
| Primary blue   | `#2563EB`   |
| Navy           | `#0A1628`   |
| Surface        | `#FAFBFF`   |
| Success        | `#059669`   |
| Warning        | `#D97706`   |
| Danger         | `#DC2626`   |
| Display font   | Syne        |
| Body font      | Figtree     |

---

## Clinical Disclaimer

ScolioCheck AI is an early-stage prototype for demonstration purposes only. It is **not** a medical device, clinical tool, or substitute for professional healthcare. All analysis values in this demo are simulated. Only a qualified clinician through physical examination and imaging can diagnose scoliosis.

---

*Built with Next.js · Tailwind CSS · TypeScript*
