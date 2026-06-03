# MITRIXO Workouts 💪

> **The most comprehensive free fitness platform** — 20+ workout programs, 16 nutrition plans, AI coaching, and a trainer dashboard. Completely free, forever.

🔗 **Live App**: [mitrixo-workouts-430356395102.europe-west1.run.app](https://mitrixo-workouts-430356395102.europe-west1.run.app)

---

## 🎯 What is MITRIXO Workouts?

MITRIXO Workouts is a **production-grade fitness platform** built to compete with premium apps like JEFIT, Hevy, Fitbod, MyFitnessPal, and Noom — but **100% free**. It combines an extensive workout and nutrition library with AI-powered coaching, a personalized training schedule, and a full trainer admin dashboard.

### ✨ Key Features

| Feature | Details |
|---|---|
| 🏋️ **20 Workout Programs** | Beginner to Advanced — Calisthenics, CrossFit, Powerlifting, Yoga, Pilates, Boxing, Olympic Lifting, HIIT, Bodybuilding, and more |
| 🥗 **16 Nutrition Plans** | 1200–3500 kcal — Keto, Mediterranean, Vegan, IF 16:8, Lean Bulk, Mass Gain, Sport-Specific, and more |
| 📅 **Training Day Selector** | Pick your available days (Mon–Sun), and the app auto-filters routines that match your schedule |
| 🤖 **AI Fitness Coach** | Personalized chat with context-aware workout and nutrition recommendations |
| 👨‍🏫 **Trainer Dashboard** | Admin panel to manage members, assign workout programs and diet plans, track clients |
| 🎨 **4 Theme Colors** | Baby Blue, Emerald, Coral, Pink — full UI accent customization |
| 📱 **Mobile-First Design** | Fully responsive, touch-friendly, works on any device |
| ⚡ **Preloader Animation** | Premium loading experience with dynamic telemetry steps |
| 🔐 **Clerk Authentication** | Secure sign-in with personalized greetings and user sessions |
| ☁️ **Google Cloud Run** | Production deployment with automatic scaling |

---

## 🏋️ Workout Library (20 Programs)

Every program includes **3-day splits** with **4–6 exercises per day**, complete with sets, reps, weight targets, and professional coaching notes.

### Beginner (6 Programs)
| Program | Focus |
|---|---|
| Absolute Beginner Full-Body | Machines & bodyweight fundamentals |
| Beginner Calisthenics Foundation | Push-up/pull-up progressions |
| Beginner Fat Loss Circuit | Low-impact HIIT with rest intervals |
| Beginner Dumbbell-Only Home | Home workout with just dumbbells |
| Beginner Women's Toning | Light weights, high reps, full-body sculpting |
| Senior Fitness & Mobility | Joint-friendly, balance, flexibility |

### Intermediate (8 Programs)
| Program | Focus |
|---|---|
| PPL Hypertrophy Classic | Push/Pull/Legs muscle building |
| Upper/Lower Power Builder | Compound lift emphasis |
| Athletic Performance HIIT | Plyometrics, agility, speed |
| Intermediate Calisthenics Skills | Muscle-ups, L-sits, pistol squats |
| Functional Fitness & CrossFit-Style | AMRAPs, EMOMs, barbell complexes |
| Classic Bodybuilding Bro Split | Chest/Back/Shoulders/Arms/Legs |
| Strength & Conditioning Hybrid | Heavy compounds + conditioning finishers |
| Core & Posture Correction | Anti-rotation, stability, thoracic mobility |

### Advanced (6 Programs)
| Program | Focus |
|---|---|
| Powerlifting Peaking | Squat/Bench/Deadlift periodization |
| Advanced Calisthenics Mastery | Planche, front lever, muscle-up combos |
| Olympic Lifting Foundation | Clean & jerk, snatch progressions |
| Extreme HIIT Metabolic Conditioning | Tabata, complexes, metabolic circuits |
| Advanced Push/Pull/Legs Volume | High volume, drop sets, giant sets |
| Warrior Hybrid Military Training | Military-style mixed modality |

---

## 🥗 Nutrition Library (16 Plans)

Every plan includes **4–6 meals** with accurate macronutrient breakdowns (protein, carbs, fat, calories).

| Category | Plans |
|---|---|
| **Fat Loss** | Aggressive 1200 kcal, Moderate Cut 1500 kcal, Keto 1550 kcal, IF 16:8 (1800 kcal), Plant-Based Cut 1600 kcal |
| **Maintenance** | Balanced 2000 kcal, Mediterranean 2100 kcal, Anti-Inflammatory 1900 kcal, Vegetarian 2000 kcal |
| **Muscle Building** | Clean Lean Bulk 2800 kcal, Mass Gain 3500 kcal, Plant-Based Muscle 2600 kcal |
| **Sport-Specific** | Endurance Fuel 2400 kcal, Calisthenics Performance 2200 kcal, Combat Sport 2000 kcal, Pre-Contest Bodybuilding 1700 kcal |

---

## 📅 Training Day Selector

Clients can **select their available training days** (Mon–Sun) to automatically filter workout programs that match their schedule:

- Toggle individual days on/off
- Programs show a "3-Day Program" badge
- Green "Fits your schedule" indicator on matching programs
- Selection persists in localStorage across sessions
- One-tap clear to show all programs

---

## 👨‍🏫 Trainer Dashboard

Platform owners can manage their clients from `/admin/trainer`:

- **View all members** with status, assigned programs, and activity
- **Assign workout programs** from the full 20-program library
- **Assign nutrition plans** from the full 16-plan library
- **Add/remove members** from the roster
- **Edit trainer notes** per client (goals, injuries, preferences)
- **Search and filter** members by name, email, or program

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    MITRIXO WORKOUTS PLATFORM                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  📱 Frontend  │  │  🤖 AI Chat   │  │  👨‍🏫 Trainer Admin  │ │
│  │  Next.js 15  │  │  OpenAI GPT  │  │  Member Management  │ │
│  │  Tailwind CSS│  │  MCP Protocol│  │  Program Assignment │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         │                 │                      │             │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐ │
│  │                    API Layer (Next.js)                     │ │
│  │  /api/plan  ·  /api/chat  ·  /api/members  ·  /api/context│ │
│  └──────────────────────┬────────────────────────────────────┘ │
│                         │                                      │
│  ┌──────────────────────▼────────────────────────────────────┐ │
│  │              Data Layer (In-Memory + MCP)                 │ │
│  │  planStore · workoutStore · nutritionStore · membersStore │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ☁️ Deployed to Google Cloud Run (europe-west1)               │
│  🔐 Authentication via Clerk                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud SDK (for deployment)

### 1. Clone & Install
```bash
git clone https://github.com/michaelmagdy15/FreeWorkoutPlanner.git
cd FreeWorkoutPlanner
npm install
```

### 2. Configure Environment
```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
# Required for AI chat
OPENAI_API_KEY=your_openai_api_key

# Required for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Optional: Redis caching
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 3. Run Locally
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Deploy to Google Cloud Run
```powershell
.\deploy.ps1
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | Full-stack React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Clerk** | Authentication & user management |
| **OpenAI GPT** | AI-powered fitness coaching |
| **MCP Protocol** | AI tool integration layer |
| **Google Cloud Run** | Serverless container deployment |
| **Upstash Redis** | Optional caching layer |

---

## 📁 Project Structure

```
FreeWorkoutPlanner/
├── app/
│   ├── page.tsx                  # Main app with all tabs
│   ├── admin/
│   │   ├── page.tsx              # System admin control center
│   │   └── trainer/page.tsx      # Trainer dashboard
│   └── api/
│       ├── chat/route.ts         # AI chat endpoint
│       ├── plan/route.ts         # Plan management
│       ├── members/route.ts      # Member CRUD
│       └── context/route.ts      # Fitness data context
├── components/
│   ├── header.tsx                # App header with auth
│   ├── routines-library.tsx      # 20 workout programs + day selector
│   ├── nutrition-library.tsx     # 16 diet plans
│   ├── preloader.tsx             # Premium loading animation
│   ├── chat-window.tsx           # AI chat interface
│   └── theme-provider.tsx        # 4-color theme system
├── lib/
│   ├── auth.tsx                  # Clerk auth wrapper
│   ├── stores.ts                 # In-memory data stores
│   └── api.ts                    # API utilities
├── deploy.ps1                    # Cloud Run deployment script
├── Dockerfile                    # Container configuration
└── middleware.ts                 # Clerk middleware
```

---

## 🤖 MCP Server Tools

The platform includes 7 MCP-compliant tools for AI integration:

| Tool | Purpose |
|---|---|
| `log-workout` | Record workout sessions |
| `log-nutrition` | Track meals and calories |
| `log-feedback` | Capture progress notes |
| `generate-plan` | AI-powered plan generation |
| `view-context` | Comprehensive fitness analysis |
| `set-weekly-target` | Goal setting and tracking |
| `echo` | System health testing |

---

## 🎨 Themes

Choose from 4 premium color accents:

| Theme | Primary Color |
|---|---|
| 🔵 Baby Blue | `hsl(200, 90%, 60%)` |
| 🟢 Emerald | `hsl(160, 84%, 39%)` |
| 🟠 Coral | `hsl(16, 100%, 66%)` |
| 🩷 Pink | `hsl(330, 80%, 65%)` |

---

## 📄 License

**MIT License** — Free to use, modify, and distribute.

---

## 🙌 Credits

Built by **Michael Mitry** ([@michaelmagdy15](https://github.com/michaelmagdy15))

**MITRIXO Workouts** — Free fitness for everyone. 💪
