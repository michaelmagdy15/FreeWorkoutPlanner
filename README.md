# Health & Fitness Coach MCP 💪

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fhealth-fitness-coach-mcp&env=OPENAI_API_KEY)

<a href="https://cursor.com/install-mcp?name=health-fitness-coach&config=eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvc3NlIn0="><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add Health & Fitness Coach MCP server to Cursor" height="32" /></a>

## 🎯 What is this Project?

**Health & Fitness Coach MCP** is a comprehensive AI-powered fitness tracking application that bridges the gap between traditional fitness apps and intelligent AI assistance through the **Model Context Protocol (MCP)**. 

This project consists of two main components:
1. **🌐 Web Application**: A modern Next.js fitness dashboard for logging activities and tracking progress
2. **🤖 MCP Server**: A protocol-compliant server that enables AI tools (Cursor, Claude Desktop, etc.) to interact with your fitness data intelligently

## 🏗️ System Architecture & MCP Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HEALTH & FITNESS COACH ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │   🌐 WEB APP        │    │   🤖 MCP SERVER     │    │  🧠 AI CLIENTS  │  │
│  │   (Next.js)         │    │   (Protocol Layer)  │    │  (Cursor/Claude) │  │
│  │                     │    │                     │    │                 │  │
│  │ • Fitness Dashboard │◄──►│ • 7 Smart Tools     │◄──►│ • Natural Lang  │  │
│  │ • Activity Logging  │    │ • Data Processing   │    │ • Context Aware │  │
│  │ • Progress Tracking │    │ • Context Analysis  │    │ • Plan Generate │  │
│  │ • Plan Visualization│    │ • API Integration   │    │ • Smart Queries │  │
│  │ • Real-time Updates │    │ • Protocol Compliance│   │ • Tool Calling  │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘  │
│           │                           │                           │          │
│           └───────────────────────────┼───────────────────────────┘          │
│                                       │                                      │
│  ┌─────────────────────────────────────▼─────────────────────────────────────┐ │
│  │                     📊 UNIFIED DATA LAYER                               │ │
│  │                                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │ 🏋️ Workouts │  │ 🍎 Nutrition │  │ 📋 Plans    │  │ 💭 Feedback │   │ │
│  │  │ • Sessions  │  │ • Meals      │  │ • AI-Gen    │  │ • Progress  │   │ │
│  │  │ • Duration  │  │ • Calories   │  │ • Weekly    │  │ • Notes     │   │ │
│  │  │ • Types     │  │ • Items      │  │ • Daily     │  │ • Insights  │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🤖 What is the MCP Server and Why It Matters?

### **Model Context Protocol (MCP) Explained**

The **Model Context Protocol** is a standardized way for AI applications to connect to external data sources and tools. Think of it as a universal translator that allows AI assistants like Claude Desktop or Cursor to understand and interact with your fitness data.

### **MCP Server Role in This Application**

Our MCP server acts as an **intelligent fitness data gateway** that:

1. **🔗 Bridges AI and Fitness Data**
   - Translates natural language fitness queries into structured data operations
   - Enables AI tools to read, write, and analyze your fitness information
   - Provides context-aware responses based on your actual fitness history

2. **🧠 Enables Intelligent Coaching**
   - AI can ask: "What workouts did I do this week?" → MCP fetches and analyzes your data
   - AI can suggest: "Create a workout plan" → MCP generates personalized routines
   - AI can track: "Log my 30-minute run" → MCP stores and updates your progress

3. **📊 Provides Rich Context**
   - When you ask AI for fitness advice, it has access to your complete history
   - AI can identify patterns, suggest improvements, and track long-term progress
   - Enables personalized coaching based on your actual performance data

## 🛠️ MCP Server Tools & Capabilities

The MCP server exposes **7 intelligent tools** that transform how AI interacts with fitness data:

### **Core Logging Tools**

#### `log-workout` - Exercise Session Tracking
```typescript
// What it does: Records workout sessions with intelligent categorization
{
  tool: "log-workout",
  parameters: {
    userId: "user123",
    date: "2025-01-07", 
    type: "strength training", // Auto-categorized: cardio, strength, flexibility
    duration: 45,              // Minutes of activity
    distance: 0                // Optional for cardio workouts
  }
}
// AI Context: "I did 45 minutes of strength training today"
```

#### `log-nutrition` - Meal & Calorie Tracking  
```typescript
// What it does: Logs meals with smart nutritional analysis
{
  tool: "log-nutrition", 
  parameters: {
    userId: "user123",
    date: "2025-01-07",
    meal: "breakfast",                    // Auto-detected: breakfast/lunch/dinner/snack
    items: ["oatmeal", "banana", "almonds"], // Natural language food items
    calories: 350                         // Calculated or estimated
  }
}
// AI Context: "I had oatmeal with banana and almonds for breakfast"
```

#### `log-feedback` - Progress & Motivation Tracking
```typescript
// What it does: Captures subjective fitness experiences and progress notes
{
  tool: "log-feedback",
  parameters: {
    userId: "user123", 
    date: "2025-01-07",
    notes: "Feeling stronger after consistent workouts. Ready for heavier weights!"
  }
}
// AI Context: Tracks motivation, energy levels, and subjective progress
```

### **Intelligence & Planning Tools**

#### `generate-plan` - AI-Powered Fitness Planning
```typescript
// What it does: Creates personalized workout and nutrition plans
{
  tool: "generate-plan",
  parameters: {
    userId: "user123"
  }
}
// AI Magic: Analyzes your history, preferences, and goals to create:
// - Tomorrow's workout routine
// - Weekly exercise schedule  
// - Meal recommendations
// - Progressive difficulty adjustments
```

#### `view-context` - Comprehensive Fitness Analysis
```typescript
// What it does: Provides complete fitness profile for AI decision-making
{
  tool: "view-context", 
  parameters: {
    userId: "user123"
  }
}
// Returns: Complete fitness history, patterns, goals, and insights
// Enables AI to make informed coaching decisions
```

#### `set-weekly-target` - Goal Setting & Tracking
```typescript
// What it does: Establishes and tracks fitness goals
{
  tool: "set-weekly-target",
  parameters: {
    userId: "user123",
    weekStart: "2025-01-06", 
    targetRuns: 3,           // Weekly cardio goal
    calorieBudget: 2000      // Daily calorie target
  }
}
// AI Context: Enables goal-oriented coaching and progress tracking
```

### **Utility Tools**

#### `echo` - System Health & Testing
```typescript
// What it does: Tests MCP connectivity and system health
{
  tool: "echo",
  parameters: {
    message: "Testing MCP connection"
  }
}
// Usage: Debugging and ensuring MCP server is responsive
```

## 🔄 MCP Data Flow & AI Integration

### **How AI Queries Become Fitness Actions**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MCP DATA FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User in AI Tool: "I did 20 push-ups for 15 minutes today"                 │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │   🧠 AI PROCESSING  │    │   🤖 MCP PROTOCOL   │    │  📊 DATA STORE  │  │
│  │                     │    │                     │    │                 │  │
│  │ • Parse intent      │───►│ • Tool selection    │───►│ • Store workout │  │
│  │ • Extract data      │    │ • Parameter mapping │    │ • Update stats  │  │
│  │ • Choose action     │    │ • Execute tool call │    │ • Calculate     │  │
│  │ • Format response   │◄───│ • Return results    │◄───│   progress      │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────┘  │
│         │                                                                   │
│         ▼                                                                   │
│  AI Response: "Great! I've logged your 15-minute push-up session.           │
│               You're at 15/60 minutes for your daily workout goal."         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Web App ↔ MCP Server Integration**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DUAL-INTERFACE SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                    ┌─────────────────────┐         │
│  │   🌐 WEB INTERFACE  │                    │  🤖 AI INTERFACE    │         │
│  │                     │                    │                     │         │
│  │ • Visual dashboard  │                    │ • Natural language  │         │
│  │ • Click logging     │                    │ • Context queries   │         │
│  │ • Progress charts   │                    │ • Smart planning    │         │
│  │ • Plan display     │                    │ • Pattern analysis  │         │
│  └─────────────────────┘                    └─────────────────────┘         │
│           │                                           │                     │
│           ▼                                           ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                     🔄 MCP SERVER CORE                                 │ │
│  │                                                                         │ │
│  │  • Unified data access for both interfaces                             │ │
│  │  • Consistent business logic and validation                            │ │
│  │  • Real-time synchronization between web and AI                        │ │
│  │  • Intelligent caching and performance optimization                    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Real-World Usage Scenarios

### **Scenario 1: Daily Workout Logging**
```
👤 User in Cursor: "I just finished a 30-minute HIIT workout"

🤖 AI + MCP Process:
1. AI recognizes workout logging intent
2. MCP calls `log-workout` tool
3. Stores: type="HIIT", duration=30, date=today
4. Updates daily progress counters
5. AI responds with encouragement and progress update

📱 Web App: Automatically shows updated workout minutes and exercise completion
```

### **Scenario 2: Intelligent Plan Generation**
```
👤 User in Claude: "Create a workout plan for tomorrow based on what I did this week"

🤖 AI + MCP Process:
1. MCP calls `view-context` to analyze week's activities
2. AI identifies patterns: mostly upper body, low cardio
3. MCP calls `generate-plan` with context
4. Creates balanced plan emphasizing legs and cardio
5. Stores plan for tomorrow

📱 Web App: Tomorrow's workout section populates with AI-generated exercises
```

### **Scenario 3: Nutrition Guidance**
```
👤 User in AI: "I'm trying to eat healthier, what should I have for lunch?"

�� AI + MCP Process:
1. MCP calls `view-context` to check today's meals and calorie goals
2. AI analyzes nutritional gaps and calorie budget
3. Suggests specific meal with calorie count
4. User confirms: "I'll have the grilled chicken salad"
5. MCP calls `log-nutrition` to record the meal

📱 Web App: Updates nutrition progress and meal history
```

## 🌟 Key Benefits of MCP Integration

### **For Users**
- **🎯 Personalized AI Coaching**: AI has complete context of your fitness journey
- **💬 Natural Interaction**: Talk to AI in plain English about fitness goals
- **📊 Intelligent Insights**: AI can identify patterns and suggest improvements
- **🔄 Seamless Experience**: Data syncs between web app and AI tools automatically

### **For Developers**
- **🔌 Protocol Compliance**: Standard MCP implementation works with any MCP client
- **🛠️ Extensible Architecture**: Easy to add new tools and capabilities
- **📈 Rich Context**: AI tools get comprehensive fitness data for better decisions
- **🔧 Flexible Deployment**: Works with Cursor, Claude Desktop, or custom AI tools

### **For AI Applications**
- **🧠 Domain Expertise**: Specialized fitness knowledge and data processing
- **📋 Structured Data**: Clean, organized fitness information for analysis
- **⚡ Real-time Updates**: Live data synchronization for current information
- **🎨 Rich Responses**: Contextual, personalized fitness coaching responses

## 🚀 Quick Start Guide

### **1. Set Up the MCP Server**
```bash
git clone https://github.com/your-username/health-fitness-coach-mcp.git
cd health-fitness-coach-mcp
npm install
cp env.example .env.local
# Add OPENAI_API_KEY for AI-generated plans
npm run dev
```

### **2. Connect to AI Tools**

#### **Cursor Configuration**
```json
{
  "mcpServers": {
    "health-fitness-coach": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

#### **Claude Desktop Configuration**
```json
{
  "mcpServers": {
    "health-fitness-coach": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/mcp"]
    }
  }
}
```

### **3. Test the Integration**
```bash
# Test MCP tools directly
npm run test:fitness

# Test specific endpoints
curl http://localhost:3000/api/context?userId=default-user
```

### **4. Start Using**
- **Web App**: Visit `http://localhost:3000` for visual fitness tracking
- **AI Integration**: Ask your AI assistant fitness-related questions
- **Natural Language**: "Log my workout", "Create a plan", "How am I doing?"

## 🔧 Technical Implementation Details

### **MCP Protocol Compliance**
```typescript
// MCP-compliant tool definition
export const logWorkoutTool = {
  name: "log-workout",
  description: "Log a workout session with type, duration, and optional distance",
  inputSchema: {
    type: "object",
    properties: {
      userId: { type: "string", description: "Unique user identifier" },
      date: { type: "string", description: "Date in YYYY-MM-DD format" },
      type: { type: "string", description: "Workout type (e.g., 'running', 'strength')" },
      duration: { type: "number", description: "Duration in minutes" },
      distance: { type: "number", description: "Distance in kilometers (optional)" }
    },
    required: ["userId", "date", "type", "duration"]
  }
}
```

### **Data Storage & Retrieval**
```typescript
// In-memory stores with persistence hooks
export const workoutStore = createInMemoryStore<WorkoutEntry>()
export const nutritionStore = createInMemoryStore<NutritionEntry>()
export const planStore = createInMemoryStore<PlanEntry>()

// MCP tool implementation
export async function logWorkout(params: LogWorkoutParams) {
  const entry: WorkoutEntry = {
    id: generateId(),
    userId: params.userId,
    date: params.date,
    type: params.type,
    duration: params.duration,
    distance: params.distance,
    timestamp: new Date().toISOString()
  }
  
  workoutStore.set(entry.id, entry)
  return { success: true, entry }
}
```

### **AI Integration Layer**
```typescript
// Chat interface with MCP integration
export async function processFitnessQuery(message: string, userId: string) {
  const intent = detectIntent(message)
  
  switch (intent.type) {
    case 'log_workout':
      return await callMCPTool('log-workout', {
        userId,
        date: intent.date,
        type: intent.workoutType,
        duration: intent.duration
      })
      
    case 'generate_plan':
      return await callMCPTool('generate-plan', { userId })
      
    case 'view_progress':
      return await callMCPTool('view-context', { userId })
  }
}
```

## 🧪 Testing & Development

### **Available Test Scripts**
```bash
# Test all MCP tools
npm run test:fitness

# Test HTTP transport
npm run test:http

# Test MCP integration
npm run test:mcp

# Debug tool functionality  
npm run debug:tools
```

### **MCP Tool Testing**
```javascript
// Test workout logging
const result = await mcpClient.callTool('log-workout', {
  userId: 'test-user',
  date: '2025-01-07',
  type: 'running',
  duration: 30,
  distance: 5.0
})

console.log('Workout logged:', result)
```

## 🚀 Deployment Options

### **Local Development**
- Run `npm run dev` for development server
- MCP server available at `http://localhost:3000/mcp`
- Web interface at `http://localhost:3000`

### **Production Deployment**
- Deploy to Vercel with one-click button
- Configure environment variables (OPENAI_API_KEY)
- MCP server automatically available at your domain

### **Custom Deployment**
- Docker support for containerized deployment
- Environment variable configuration for different setups
- Scalable architecture for multiple users

## 🔧 Environment Configuration

### **Required Variables**
```env
# OpenAI API key for AI-generated fitness plans
OPENAI_API_KEY=your_openai_api_key_here

# Optional Redis for enhanced performance
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### **Optional Configuration**
```env
# Custom user ID for single-user setups
DEFAULT_USER_ID=my-fitness-journey

# Logging level for debugging
LOG_LEVEL=debug

# Custom port for development
PORT=3000
```

## 🤝 Contributing & Extending

### **Adding New MCP Tools**
```typescript
// Create new tool in tools/ directory
export const myCustomTool = {
  name: "my-custom-tool",
  description: "Description of what this tool does",
  inputSchema: {
    // Define parameters
  },
  handler: async (params) => {
    // Implementation
  }
}

// Register in tools/index.ts
export const tools = [
  // ... existing tools
  myCustomTool
]
```

### **Extending the Web Interface**
- Add new components in `components/` directory
- Create API routes in `app/api/` for new functionality
- Update the main dashboard in `app/page.tsx`

### **Custom AI Integrations**
- Implement additional MCP clients
- Add support for other AI platforms
- Create custom query processing logic

## 📄 License & Usage

**MIT License** - Feel free to use this project as a foundation for your own MCP servers and fitness applications.

This project demonstrates how to build production-ready MCP servers that bridge AI tools with domain-specific applications, providing a template for similar integrations in other domains.

---

**🤖 Powered by Model Context Protocol**  
*Bridging AI intelligence with real-world fitness data*
