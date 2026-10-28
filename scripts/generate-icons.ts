import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean, high-contrast, popping vector SVG illustration for TinyBloom
// Baby (warm rosy peach), Cloud (bright white with cool shadow), Vine (vibrant leaf green), Stars (glowing gold)
export const TINYBLOOM_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF5" />
      <stop offset="100%" stop-color="#F2EDE0" />
    </linearGradient>

    <!-- Vine / Sprout Gradient -->
    <linearGradient id="vineGrad" x1="0%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#1B5E20" />
      <stop offset="50%" stop-color="#2E7D32" />
      <stop offset="100%" stop-color="#4CAF50" />
    </linearGradient>
    <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2E7D32" />
      <stop offset="100%" stop-color="#66BB6A" />
    </linearGradient>
    <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#388E3C" />
      <stop offset="100%" stop-color="#81C784" />
    </linearGradient>

    <!-- Baby Skin Gradient -->
    <radialGradient id="skinGrad" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFE0C2" />
      <stop offset="70%" stop-color="#FCD0A1" />
      <stop offset="100%" stop-color="#F7BA80" />
    </radialGradient>

    <!-- Cloud Gradient & Shadows -->
    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="85%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>

    <!-- Golden Star Gradient -->
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <!-- Soft Drop Shadow for Elements -->
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2D3B2C" flood-opacity="0.12" />
    </filter>
    <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#152B14" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- App Badge Rounded Container -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="#65895E" stroke-opacity="0.25" stroke-width="4" />

  <!-- Background Ambient Glow -->
  <circle cx="256" cy="256" r="190" fill="#E8F4E5" opacity="0.6" />

  <!-- 1. The Sprout & Curling Vine (Bottom & Left) -->
  <!-- Main Curling Stem -->
  <path d="M 370 340 C 370 415, 230 450, 155 405 C 105 375, 95 305, 120 220 C 135 170, 170 120, 185 85 C 190 75, 198 85, 194 98 C 182 145, 148 215, 142 270 C 135 320, 160 365, 215 375 C 275 385, 340 370, 370 340 Z"
        fill="url(#vineGrad)"
        filter="url(#badgeShadow)" />

  <!-- Sprout Leaf 1 (Top Left Primary Leaf) -->
  <path d="M 185 85 C 130 90, 85 135, 115 195 C 145 205, 190 170, 185 85 Z"
        fill="url(#leafGrad1)"
        stroke="#1B5E20" stroke-width="3" stroke-opacity="0.2" />
  <path d="M 135 175 Q 155 140, 182 92" fill="none" stroke="#C8E6C9" stroke-width="4" stroke-linecap="round" opacity="0.6" />

  <!-- Sprout Leaf 2 (Smaller accent leaf) -->
  <path d="M 188 120 C 185 70, 235 60, 255 105 C 245 135, 205 145, 188 120 Z"
        fill="url(#leafGrad2)"
        stroke="#1B5E20" stroke-width="3" stroke-opacity="0.2" />
  <path d="M 198 122 Q 220 105, 250 102" fill="none" stroke="#E8F5E9" stroke-width="3" stroke-linecap="round" opacity="0.6" />

  <!-- 2. Golden Sparkle Stars (Top Right) -->
  <!-- Large Star -->
  <g transform="translate(325, 90) scale(1.15)">
    <path d="M 0,-24 Q 4,-4 24,0 Q 4,4 0,24 Q -4,4 -24,0 Q -4,-4 0,-24 Z"
          fill="url(#starGrad)" />
    <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
  </g>
  <!-- Small Star -->
  <g transform="translate(378, 145) scale(0.75)">
    <path d="M 0,-22 Q 3,-3 22,0 Q 3,3 0,22 Q -3,3 -22,0 Q -3,-3 0,-22 Z"
          fill="url(#starGrad)" />
    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
  </g>

  <!-- 3. Baby Sleeping Head (Rich warm peach with sweet facial features) -->
  <g id="babyHead">
    <!-- Baby Ear Right -->
    <circle cx="340" cy="250" r="26" fill="#F7BA80" stroke="#E5985C" stroke-width="3" />
    <path d="M 338 242 Q 346 250, 338 258" fill="none" stroke="#D07D40" stroke-width="3.5" stroke-linecap="round" />

    <!-- Baby Face -->
    <circle cx="265" cy="235" r="92" fill="url(#skinGrad)" stroke="#E5985C" stroke-width="3.5" />

    <!-- Rosy Glowing Cheeks (Popping warm blush) -->
    <ellipse cx="218" cy="264" rx="22" ry="14" fill="#FB7185" opacity="0.55" />
    <ellipse cx="304" cy="264" rx="22" ry="14" fill="#FB7185" opacity="0.55" />

    <!-- Sweet Hair Curl on Top -->
    <path d="M 245 145 C 265 145, 275 160, 260 178 C 248 192, 235 185, 238 174 C 240 165, 252 165, 250 156"
          fill="none" stroke="#4A2810" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Left Sleeping Eye (Curved peaceful lashes) -->
    <path d="M 205 236 Q 220 252, 235 236" fill="none" stroke="#381A08" stroke-width="6.5" stroke-linecap="round" />
    <!-- Right Sleeping Eye -->
    <path d="M 278 236 Q 293 252, 308 236" fill="none" stroke="#381A08" stroke-width="6.5" stroke-linecap="round" />

    <!-- Little Eyebrows -->
    <path d="M 208 220 Q 220 214, 232 219" fill="none" stroke="#5C3317" stroke-width="4" stroke-linecap="round" opacity="0.85" />
    <path d="M 282 219 Q 294 214, 306 220" fill="none" stroke="#5C3317" stroke-width="4" stroke-linecap="round" opacity="0.85" />

    <!-- Button Nose -->
    <circle cx="256" cy="248" r="4.5" fill="#E08B52" opacity="0.9" />

    <!-- Sweet Peaceful Smile -->
    <path d="M 242 272 Q 256 288, 270 272" fill="none" stroke="#381A08" stroke-width="5.5" stroke-linecap="round" />
  </g>

  <!-- 4. Bright Crisp White Cloud (Cradles the baby with distinct contour outline) -->
  <g id="cloud" filter="url(#cloudShadow)">
    <!-- Base Cloud Shape with Crisp White and Cool Depth -->
    <path d="M 160 330
             C 140 330, 125 305, 140 285
             C 145 265, 175 255, 195 270
             C 215 250, 255 245, 275 268
             C 295 248, 335 250, 350 275
             C 375 270, 395 290, 390 315
             C 405 335, 395 365, 370 375
             C 350 395, 310 395, 290 380
             C 270 398, 220 400, 200 380
             C 180 390, 150 380, 145 355
             C 135 345, 145 330, 160 330 Z"
          fill="url(#cloudGrad)"
          stroke="#CBD5E1"
          stroke-width="4" />

    <!-- Cloud Soft Light Highlights -->
    <ellipse cx="205" cy="285" rx="35" ry="20" fill="#FFFFFF" />
    <ellipse cx="295" cy="285" rx="35" ry="20" fill="#FFFFFF" />
    <ellipse cx="355" cy="315" rx="25" ry="18" fill="#FFFFFF" />
    <ellipse cx="165" cy="320" rx="20" ry="15" fill="#FFFFFF" />
  </g>

  <!-- Golden Heart Accent on Vine -->
  <g transform="translate(145, 370) rotate(-15) scale(0.65)">
    <path d="M 12,21.35 C -8,7.3 3,-4 12,3 C 21,-4 32,7.3 12,21.35 Z"
          fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  const imagesDir = path.join(publicDir, 'assets', 'images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Write the vector SVG to /public/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), TINYBLOOM_ICON_SVG);
  console.log('Saved /public/icon.svg');

  const svgBuffer = Buffer.from(TINYBLOOM_ICON_SVG);

  // 2. Generate PNGs: 64x64, 180x180 (apple-touch-icon), 192x192, 512x512, and emblem
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon-64x64.png'));
  console.log('Generated favicon-64x64.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  await sharp(svgBuffer).resize(256, 256).png().toFile(path.join(imagesDir, 'tinybloom-emblem.png'));
  console.log('Generated tinybloom-emblem.png');
}

main().catch(console.error);
