<div align="center">
  <br />
    <a href="https://www.youtube.com/watch?v=LKrX390fJMw" target="_blank">
      <img src="assets/readme/hero.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_Native-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/-Expo-black?style=for-the-badge&logoColor=white&logo=expo&color=000020" alt="Expo" />
        <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=F02E65" alt="Appwrite" />
    <img src="https://img.shields.io/badge/-Tailwind-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
  </div>

  <h3 align="center">Food Delivery Mobile App</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube. Join the JSM family!
    </div>
</div>
# Food Ordering Web Application

A modern food ordering application built with Expo/React Native, TypeScript, Tailwind (NativeWind), and Appwrite for backend services. This repository contains the source used in a tutorial and is adapted for web and mobile (Expo) targets.

Live repository: https://github.com/omkarkalagi/food-ordering-web-application

## Quick overview
- Frameworks: Expo / React Native (web support via Expo), NativeWind (Tailwind), TypeScript
- Backend: Appwrite (auth, database, file storage)
- State: Zustand

## Getting started (development)

Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Git

Clone and install

```powershell
git clone https://github.com/omkarkalagi/food-ordering-web-application.git
cd food-ordering-application
npm install
```

Environment

Create a `.env` file in the repository root and add the Appwrite values you need (example):

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_ENDPOINT=
```

Run (Expo)

```powershell
npx expo start
```

Open the project in a web browser (press "w" in the Expo CLI) or use the Expo Go app on a device.

## Project structure (high-level)

- `app/` — Application routes and screens (Expo Router / App Router style)
- `components/` — Reusable UI components
- `assets/` — Images and fonts
- `lib/` — Helpers and integrations (Appwrite client, seed data)
- `store/` — Zustand stores

## README / Docs improvements included

- Clear quick start and environment instructions
- Project overview and tech-stack summary

## Deploying to Vercel (brief)

This project can be deployed with the Vercel CLI. Basic steps:

1. Install `vercel` (optional): `npm i -g vercel` or use `npx vercel`.
2. From the project root run: `npx vercel --prod --confirm`

If you want to deploy programmatically (CI) you can pass `--token <YOUR_TOKEN>` to the CLI or set `VERCEL_TOKEN` in the environment. I can deploy this for you if you provide a Vercel token (you already provided one; I'll proceed when you confirm).

## Notes & next steps

- If you expect a Next.js deployment on Vercel, confirm which folder should be built (`app/` looks like an Expo Router layout). Some projects need extra build configuration when deploying to Vercel; I can add a `vercel.json` or simple GitHub Action if required.
- I did not change any source code other than documentation.

## License

MIT
