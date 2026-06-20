# LifeSpan-AI

LifeSpan-AI is a modern Next.js web application engineered to analyze health metrics, deliver lifespan assessments, and provide personalized AI-driven wellness insights. Built with TypeScript and integrated with Supabase for robust backend management and data storage.

---

## 🚀 Features

*   **Health Assessments:** Comprehensive evaluation pathways for user health telemetry.
*   **User Authentication:** Secure signup, login, and session tracking via Supabase Auth.
*   **Personalized Dashboard:** Dynamic visualization of metrics, trends, and AI-driven insights.
*   **Debug Suite:** Built-in sandbox routes for structural testing and metric validation.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js (App Router, Tailwind CSS)
*   **Language:** TypeScript
*   **Database & Auth:** Supabase
*   **Package Manager:** pnpm

---

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed, along with **pnpm**:

```bash
npm install -g pnpm

```

### Installation

1. Clone the repository and navigate into the folder:

```bash
   cd lifespan-ai

```

2. Install dependencies:

```bash
   pnpm install

```

*(Note: If prompted with an `[ERR_PNPM_IGNORED_BUILDS]` message regarding the `sharp` dependency, run `pnpm approve-builds sharp` before proceeding.)*

3. Configure your Environment Variables:
Create a `.env.local` file in the root directory and append your Supabase credentials:

```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### Running Locally

To boot the local development server:

```bash
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application live.

---

## 📂 Project Architecture

```text
├── app/                  # Next.js core application routes
│   ├── assessment/       # Health assessment questionnaires
│   ├── auth/             # Login, signup, and authentication states
│   ├── dashboard/        # Main user portal and analytics interface
│   └── debug/            # Core development testing routes
├── components/           # Reusable global UI modules
├── hooks/                # Custom React lifecycle hooks
├── lib/                  # Shared utilities and configurations
│   └── supabase/         # Core Supabase client engine setup
└── public/               # Static media and assets

```

```

---

### 🛡️ Step 2: Ensure your secrets are safe
Make sure you click **"Create new file"** again, name it `.gitignore`, and make sure it has this block inside it so your private database parameters never leak onto the web:

```text
# Local env files
.env*.local

# Dependencies
node_modules/
.pnpm-store/

# Next.js Build Output
.next/
out/
build/
