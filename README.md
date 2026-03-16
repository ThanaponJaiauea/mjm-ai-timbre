# 🎵 mjm-ai-timbre

A modern web and desktop application for exploring and designing sounds (timbre) using the power of Local AI (Ollama), real-time Web Audio API, and a versatile node-based flow editor.

![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![Ollama](https://img.shields.io/badge/AI-Ollama-white)
![Tone.js](https://img.shields.io/badge/Audio-Tone.js-ff69b4)

## ✨ Features

- 🤖 **AI-Powered**: Chat and process logic using Local AI via Ollama for a private and cost-effective experience. Utilizes Vercel AI SDK.
- 🎨 **Rich Content Rendering**: Render Markdown, Math, Mermaid diagrams, and code snippets smoothly using Streamdown and Shiki.
- 🎵 **Audio Synthesis**: In-browser audio synthesis and music theory capabilities powered by Tone.js and Tonal.js.
- 🎛️ **Visual Node Editor**: A flexible node-connecting interface for designing audio logic and flows, built with React Flow (`@xyflow/react`).
- 💻 **Cross-Platform / Desktop App**: Includes a dedicated setup and scripts to build and run as a standalone Windows desktop application.
- 💅 **Modern UI**: Beautiful, responsive, and accessible user interface supporting Dark Mode, styled with Tailwind CSS v4, shadcn/ui, and Radix UI.

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router), React 19
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, Lucide Icons
- **State Management & Data Fetching:** Zustand, React Query (`@tanstack/react-query`)
- **AI Integration:** Vercel AI SDK, Ollama Provider
- **Audio & Visuals:** Tone.js, Tonal.js, React Flow
- **Tooling:** TypeScript, Biome, ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- [Ollama](https://ollama.com/) installed and running locally on your machine for AI features.

### Installation

1. Clone the repository (if applicable) and navigate to the project directory:
   ```bash
   cd mjm-ai-timbre
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up your environment variables. (Check the `.env` file for required configurations like database or Ollama endpoint).

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📦 Desktop Application (Windows)

This project can be built into a Windows desktop application. 

- To copy the web build to the desktop app directory:
  ```bash
  npm run desktop:copy
  ```
- To build the standalone Windows executable:
  ```bash
  npm run desktop:build
  ```

## 📝 License

This project is open-source. Please add a `LICENSE` file for more details.
