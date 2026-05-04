// ─── Demo Sample Image ───────────────────────────────────────────────────────
// Generates an inline SVG data-URL that looks like a clinical back-posture
// photograph. Used when the user clicks "Use sample image" so the demo always
// works without an actual photo.
// ─────────────────────────────────────────────────────────────────────────────

export function getSampleImageDataUrl(): string {
  const svg = `<svg width="400" height="620" viewBox="0 0 400 620"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8e2d8"/>
        <stop offset="100%" stop-color="#d4cec4"/>
      </linearGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#c9a880"/>
        <stop offset="100%" stop-color="#b8916a"/>
      </linearGradient>
      <linearGradient id="skinDark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#b8916a"/>
        <stop offset="100%" stop-color="#a07a56"/>
      </linearGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="1.2"/>
      </filter>
      <pattern id="clinicalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#bdb7ac" stroke-width="0.5" opacity="0.5"/>
      </pattern>
    </defs>

    <!-- Clinical background -->
    <rect width="400" height="620" fill="url(#bg)"/>
    <rect width="400" height="620" fill="url(#clinicalGrid)"/>

    <!-- Subtle vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
    </radialGradient>
    <rect width="400" height="620" fill="url(#vignette)"/>

    <!-- ── Measurement ruler (left side) ── -->
    <line x1="28" y1="100" x2="28" y2="580" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="100" x2="32" y2="100" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="200" x2="32" y2="200" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="300" x2="32" y2="300" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="400" x2="32" y2="400" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="500" x2="32" y2="500" stroke="#9ca3af" stroke-width="1"/>
    <line x1="24" y1="580" x2="32" y2="580" stroke="#9ca3af" stroke-width="1"/>
    <text x="18" y="103" font-size="8" fill="#9ca3af" font-family="monospace" text-anchor="middle">0</text>
    <text x="18" y="203" font-size="8" fill="#9ca3af" font-family="monospace" text-anchor="middle">10</text>
    <text x="18" y="303" font-size="8" fill="#9ca3af" font-family="monospace" text-anchor="middle">20</text>
    <text x="18" y="403" font-size="8" fill="#9ca3af" font-family="monospace" text-anchor="middle">30</text>
    <text x="18" y="503" font-size="8" fill="#9ca3af" font-family="monospace" text-anchor="middle">40</text>
    <text x="13" y="583" font-size="7" fill="#9ca3af" font-family="monospace" text-anchor="middle">cm</text>

    <!-- ── Human silhouette – back view with slight asymmetry ── -->

    <!-- Hair -->
    <ellipse cx="200" cy="58" rx="36" ry="42" fill="#3d2b1a"/>
    <ellipse cx="200" cy="75" rx="34" ry="30" fill="#4a3322"/>

    <!-- Head -->
    <ellipse cx="200" cy="70" rx="30" ry="36" fill="url(#skin)"/>

    <!-- Neck -->
    <rect x="189" y="100" width="22" height="26" rx="5" fill="url(#skin)"/>

    <!-- ── Shoulders (right shoulder visibly ~6px higher for asymmetry) ── -->
    <!-- Left shoulder -->
    <ellipse cx="133" cy="134" rx="38" ry="22" fill="url(#skin)" transform="rotate(-8,133,134)"/>
    <!-- Right shoulder -->
    <ellipse cx="267" cy="128" rx="38" ry="22" fill="url(#skin)" transform="rotate(8,267,128)"/>
    <!-- Shoulder bridge -->
    <path d="M 105 140 C 140 122, 200 118, 260 120 C 280 118, 300 122, 310 138"
      stroke="url(#skin)" stroke-width="24" fill="none" stroke-linecap="round"/>

    <!-- Left upper arm -->
    <path d="M 98 150 C 78 170, 68 230, 72 295 C 70 318, 76 338, 84 348 L 102 342
      C 96 326, 92 306, 93 285 C 92 228, 105 170, 114 152 Z"
      fill="url(#skinDark)"/>
    <!-- Right upper arm -->
    <path d="M 302 146 C 322 166, 332 226, 328 291 C 330 314, 324 334, 316 344 L 298 338
      C 304 322, 308 302, 307 281 C 308 224, 295 166, 286 148 Z"
      fill="url(#skinDark)"/>

    <!-- ── Torso / back ── -->
    <path d="
      M 114 152
      C 108 195, 100 270, 104 355
      C 140 372, 172 378, 200 377
      C 228 378, 260 372, 296 355
      C 300 270, 292 195, 286 148
      C 255 138, 228 134, 200 133
      C 172 134, 145 138, 114 152
    Z" fill="url(#skin)"/>

    <!-- Spine groove (darker midline) -->
    <path d="M 200 118 C 200.5 200, 201.5 295, 202 365"
      stroke="#a07a56" stroke-width="3" fill="none" opacity="0.35" filter="url(#softBlur)"/>

    <!-- Left erector spine muscle definition -->
    <path d="M 177 155 C 172 210, 168 280, 172 345"
      stroke="#a07a56" stroke-width="2" fill="none" opacity="0.25" filter="url(#softBlur)"/>
    <!-- Right erector spine muscle -->
    <path d="M 223 152 C 228 207, 232 277, 228 342"
      stroke="#a07a56" stroke-width="2" fill="none" opacity="0.25" filter="url(#softBlur)"/>

    <!-- Scapula left -->
    <ellipse cx="162" cy="205" rx="22" ry="28" fill="#b8906a" opacity="0.3" transform="rotate(-5,162,205)"/>
    <!-- Scapula right -->
    <ellipse cx="238" cy="202" rx="22" ry="28" fill="#b8906a" opacity="0.3" transform="rotate(5,238,202)"/>

    <!-- Waist narrowing (right side slightly higher) -->
    <path d="M 104 355 C 110 375, 145 388, 200 390 C 255 388, 290 375, 296 355"
      fill="#b8916a" stroke="none"/>

    <!-- Lower back / hip area hint -->
    <path d="M 104 355 C 106 400, 128 450, 140 530 L 180 530
      C 174 455, 168 400, 170 360" fill="#b5906a"/>
    <path d="M 296 355 C 294 400, 272 450, 260 530 L 220 530
      C 226 455, 232 400, 230 360" fill="#b5906a"/>

    <!-- ── Clinical metadata overlay ── -->
    <rect x="44" y="580" width="312" height="30" rx="4" fill="rgba(10,22,40,0.72)"/>
    <text x="58" y="599" font-size="10" fill="#94a3b8" font-family="monospace">ID: SCK-DEMO-001</text>
    <text x="200" y="599" font-size="10" fill="#94a3b8" font-family="monospace" text-anchor="middle">DORSAL VIEW</text>
    <text x="342" y="599" font-size="10" fill="#f59e0b" font-family="monospace" text-anchor="end">DEMO ONLY</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
