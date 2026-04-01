# CATALYST: Cinematic AI Mastery Simulation
**"Precision-Engineered Learning for the AI Era"**

> **"Traditional learning tells you what to know. CATALYST simulates who you need to become."**

CATALYST is a cinematic, AI-driven simulation platform for mastery-based learning. It transforms the technical upskilling journey into a high-stakes simulation—analyzing your professional DNA, mapping strategic skill gaps, and stress-testing your "Project Intelligence" through immersive AI challenges.

---

## 🚀 Key Features

### 🧠 Phase 1: Skill DNA Analysis (IMPLEMENTED)
- **Resume Extraction**: Gemini-powered parsing of PDF/DOCX resumes.
- **Skill Heatmap**: Visual categorization of Technical, Tool, and Soft skills.
- **Evidence-Based Mapping**: Proficiency levels validated with specific content from your professional history.

### 🎯 Phase 2: Strategic Gap Analysis (IMPLEMENTED)
- **Role Benchmarking**: Compare your current skill set against target industry roles.
- **Readiness Metrics**: High-fidelity charts (Recharts) visualizing your match percentage.
- **Visual Gaps**: Instant identification of missing critical skills.

### 🗺️ Phase 3: Dynamic Learning Roadmap (IMPLEMENTED)
- **Adaptive Planning**: Week-by-week learning timeline based on your available effort.
- **Consolidated Dashboard**: A single hub for tracking your "Skill Evolution."
- **Resource Aggregation**: Intelligent curation of documentation and tutorials.

### 🛡️ Phase 4: Project Intelligence Quiz (IMPLEMENTED)
- **Artifact Extraction**: AI extracts live projects directly from your resume.
- **Simulation Challenges**: Tailored "What if?" technical quizzes based on your real-world architecture.
- **Intelligence Sync**: Seamless background processing of previously uploaded context.

### 🚧 Future Frontiers
- **Phase 5**: Real-time Socratic Mission Terminals.
- **Phase 6**: Enterprise Hiring Readiness Scores.

---

## 🛠️ Tech Stack

### Frontend (Next.js 15)
- **Runtime**: Next.js 15 (App Router) + Cloudflare Edge optimization.
- **Auth**: Clerk Authentication (Protected & Public routes).
- **Styling**: Tailwind CSS + Shadcn UI (Glassmorphic Design).
- **Motion**: Framer Motion + GSAP (Cinematic transitions).
- **Viz**: Recharts (Responsive Readiness Charts).

### Backend (Node.js/Express)
- **Database**: MongoDB (Atlas/Local).
- **Intelligence**: Google Gemini 1.5 Flash (via OpenRouter).
- **Optimization**: LRU-based intelligent caching for AI responses.

---

## 📋 Setup Instructions

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/saurabh24thakur/CATALYST.git

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_ai_key
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
```

### 3. Execution
**Terminal 1**: `cd server && npm run dev`  
**Terminal 2**: `cd client && npm run dev`

Navigate to: **http://localhost:3000**

---

## 🎨 Design Philosophy: The "Aino" Aesthetic
CATALYST moves away from generic dark-mode patterns toward a **Premium, High-Contrast Light Theme**.
- **Glassmorphism**: Sophisticated blur intensities and white-border opacity.
- **Motion Continuity**: Seamless GSAP timelines and Lenis smooth scroll for a cinematic feel.
- **Minimalist Branding**: A focus on high-fidelity metrics and socratic simplicity.

---

## 🔑 Key API Endpoints
- `POST /api/resume/upload`: Advanced skill extraction with full context persistence.
- `POST /api/resume/extract-projects`: AI-driven project artifact identification.
- `POST /api/roadmap/generate`: Adaptive timeline creation for target roles.

---

## 🤝 Contributing
This project is built for the technical mastery of modern developers. Fork it, bridge your gaps, and contribute to the evolution.

**License**: MIT  
**Built with ❤️ for the Mastery Movement** 🏆
