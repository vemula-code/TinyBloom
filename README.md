# 🌱 TinyBloom · Every little milestone matters.

> *"You never realize how fast time moves until you look down at the little human who was once just a tiny bundle in your arms, now sitting up, laughing with two tiny teeth, and reaching for the world with wonder."*

A calm, gentle, and 100% private offline-first baby growth and milestone companion powered by the official **World Health Organization (WHO) Child Growth Standards**.

---

## 💛 A Letter to Parents

They tell you that the days are long, but the years are short.

One quiet night, you were holding a tiny, fragile bundle against your chest, learning the rhythm of newborn breaths and counting every single ounce gained. Then, before you know it, months slip by—and that same little human is sitting up, laughing out loud with tiny teeth, babbling whole conversations (`ba-ba`, `da-da`), and reaching for your hand with curious fingers.

Every gram gained, every centimeter grown, and every little head-circumference checkup is a quiet miracle. It is tangible proof of love, of nourishment, and of how big your little heart is getting.

When commercial parenting apps began locking growth charts, percentiles, and historical records behind paid monthly subscriptions or selling personal family data to advertisers, we built **TinyBloom**. 

**TinyBloom** belongs to parents. No paywalls, no subscriptions, no accounts, and no surveillance. 100% of your baby's data stays securely on your device.

---

## 🌟 Key Features

### 🛡️ 1. Absolute On-Device Privacy (Zero Cloud Tracking)
- **Local Sovereignty**: All measurements, photos, milestone checklists, and doctor questions are stored in your device's browser/local storage (`localStorage`).
- **No Accounts or Passwords**: Never asks for email, login, or phone number.
- **No Remote Telemetry**: Zero ads, zero tracking pixels, zero analytics scripts, and zero online AI APIs transmitting baby data.
- **Offline First**: Works completely offline—in pediatric clinics, on airplanes, or in the nursery without Wi-Fi.

### 📈 2. Clinical WHO Growth Percentiles
- **Official WHO Standards**: Calibrated to the World Health Organization Child Growth Standards (the gold standard recommended by the CDC and American Academy of Pediatrics).
- **Three Core Indicators**:
  - **Weight-for-Age** (kg / lbs·oz)
  - **Length-for-Age** (cm / inches)
  - **Head Circumference-for-Age** (cm / inches)
- **Interactive SVG Trajectory Curves**: Plots your baby's actual measurements against official 3rd, 15th, 50th, 85th, and 97th percentile bands.
- **Growth Philosophy**: Clear pediatric reminders that a single percentile is a marker of trajectory, never a grade or a competition.

### 👶 3. Universal Milestones Guide (0 to 36 Months / 3 Years)
Covers month-by-month and milestone-stage granularity from birth up to 3 years:
- **0–1 Month (Newborn Wonder)**: Chest-to-chest tummy time, high-contrast tracking, regaining birth weight.
- **2 Months**: Social smiles, 45° head lifts, coos, 2-month vaccine prep.
- **3 Months**: Bringing hands to mouth, batting play-gym toys, vocal squeals.
- **4 Months**: Rolling tummy-to-back, belly laughs, 4-month checkup.
- **5 Months**: Grabbing toes, rolling both ways, high-chair curiosity.
- **6 Months**: Tripod sitting, single-ingredient solids, first teeth signs, 6-month vaccines.
- **7 Months**: Independent sitting, lower central incisors erupting, consonant babbles (`ba-ba`, `da-da`).
- **8 Months**: Pincer grasp, peek-a-boo, army crawling, separation warmth.
- **9 Months**: Hands-and-knees crawling, pulling to stand, 9-month developmental checkup.
- **10–11 Months**: Cruising along furniture, waving bye-bye, standing alone briefly.
- **12 Months (1 Year)**: First independent steps, first words, 1-year birthday milestone, transitioning to whole milk.
- **15 Months**: Climbing onto couches, stacking 2–3 blocks, 5+ words.
- **18 Months**: Word explosion (10–20+ words), running, spoon feeding, 18-month autism screening (M-CHAT).
- **24 Months (2 Years)**: 2-word sentences ("more milk"), jumping with both feet, toddler autonomy.
- **30 Months (2.5 Years)**: Potty training readiness, pretend kitchen play, 3-word sentences.
- **36 Months (3 Years)**: Full sentences, tricycle pedaling, cooperative preschool friendships, 3-year visit.

### 🎨 4. Day & Night Modes + 5 Color Palettes
- **Night Mode (2 AM Feedings)**: Gentle midnight slate theme designed for tired eyes during late-night nursing and diaper changes.
- **5 Color Palettes**:
  - 🌿 **Sage Meadow** (Calming natural sage, cream, and forest)
  - 🌸 **Peach Blossom** (Warm apricot, soft terracotta, and rose)
  - 🌊 **Ocean Breeze** (Muted coastal sky blue and periwinkle)
  - 🍯 **Golden Sunbeam** (Gentle honey, buttercup, and warm amber)
  - 💜 **Lavender Dream** (Soft lilac, plum, and evening mist)

### 🩺 5. Doctor Visit Brief (Printable Report)
- One-click printable clinical summary formatted for 8.5x11 / A4 paper.
- Shows latest measurements, percentile rankings, growth velocity, and custom parent questions for your pediatrician.

### 💾 6. Private Backup & Device Sync
- **Instant JSON Export**: Save a complete backup to your personal computer or cloud drive anytime.
- **CSV Spreadsheet Export**: Export full audit tables to Excel or Google Sheets.
- **Validated Restore**: Move data between your phone and your spouse's phone with zero friction.

---

## 📱 How to Install on Your Phone

TinyBloom is a certified Progressive Web App (PWA). You can install it directly to your home screen with zero app store downloads:

### On Samsung / Android:
1. Open the app link in **Google Chrome** or **Samsung Internet**.
2. Tap the **Install TinyBloom** button at the top header (or tap the `⋮` three dots &rarr; **Add to Home screen** / **Install App**).
3. TinyBloom will install directly into your phone's App Drawer with its own icon and launch full-screen without address bars.

### On iPhone (iOS):
1. Open the app link in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing upward).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. TinyBloom will appear on your iPhone home screen!

---

## 🚀 Deployment Guide

### Option 1: GitHub Pages
1. Go to your repository on GitHub &rarr; **Settings** &rarr; **Pages** (in the left sidebar).
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. *(If your repository is Private on a free account, scroll to Settings &rarr; General &rarr; Danger Zone &rarr; Change repository visibility &rarr; Make public)*.
4. Go to the **Actions** tab &rarr; **Deploy TinyBloom to GitHub Pages** &rarr; click **Re-run all jobs**.
5. Your app will deploy to `https://<username>.github.io/<repo-name>/`.

### Option 2: Vercel
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically use the included `vercel.json` and `.npmrc` (`legacy-peer-deps=true`).
3. Click **Deploy**.

---

## 🛠️ Built With
- **React 19** & **TypeScript**
- **Tailwind CSS v4**
- **Vite** & **vite-plugin-pwa**
- **Bundled WHO Child Growth Standards** (LMS reference datasets)

---

## 🕊️ For Dhruv & Every Growing Child
*May you always grow strong, curious, kind, and full of joy. We love you more than all the stars in the night sky.*
