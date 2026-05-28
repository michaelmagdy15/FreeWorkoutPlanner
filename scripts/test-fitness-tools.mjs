import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "fitness-coach-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  await client.connect(transport);

  console.log("🔗 Connected to Health & Fitness Coach MCP server");
  console.log("📋 Server capabilities:", client.getServerCapabilities());

  console.log("\n🔧 Listing available tools...");
  const tools = await client.listTools();
  console.log("Available tools:", JSON.stringify(tools, null, 2));

  if (tools.tools && tools.tools.length > 0) {
    const testUserId = "test-user-123";
    const testDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    console.log(`\n🏃‍♀️ Testing workout logging tool...`);
    try {
      const workoutResult = await client.callTool("log-workout", {
        userId: testUserId,
        date: testDate,
        type: "running",
        duration: 30,
        distance: 5.2
      });
      console.log("Workout logging result:");
      console.log(workoutResult.content[0].text);
    } catch (error) {
      console.error("Error testing workout logging:", error.message);
    }

    console.log(`\n🍎 Testing nutrition logging tool...`);
    try {
      const nutritionResult = await client.callTool("log-nutrition", {
        userId: testUserId,
        date: testDate,
        meal: "breakfast",
        items: ["oatmeal", "banana", "almonds"],
        calories: 350
      });
      console.log("Nutrition logging result:");
      console.log(nutritionResult.content[0].text);
    } catch (error) {
      console.error("Error testing nutrition logging:", error.message);
    }

    console.log(`\n🎯 Testing weekly target setting...`);
    try {
      const targetResult = await client.callTool("set-weekly-target", {
        userId: testUserId,
        weekStart: testDate,
        targetRuns: 3,
        calorieBudget: 2000
      });
      console.log("Target setting result:");
      console.log(targetResult.content[0].text);
    } catch (error) {
      console.error("Error testing target setting:", error.message);
    }

    console.log(`\n💭 Testing feedback logging...`);
    try {
      const feedbackResult = await client.callTool("log-feedback", {
        userId: testUserId,
        date: testDate,
        notes: "Feeling great after today's run! Ready to increase distance next week."
      });
      console.log("Feedback logging result:");
      console.log(feedbackResult.content[0].text);
    } catch (error) {
      console.error("Error testing feedback logging:", error.message);
    }

    console.log(`\n📊 Testing context viewing...`);
    try {
      const contextResult = await client.callTool("view-context", {
        userId: testUserId
      });
      console.log("Context viewing result:");
      console.log(contextResult.content[0].text);
    } catch (error) {
      console.error("Error testing context viewing:", error.message);
    }

    console.log(`\n🎯 Testing plan generation...`);
    try {
      const planResult = await client.callTool("generate-plan", {
        userId: testUserId
      });
      console.log("Plan generation result:");
      console.log(planResult.content[0].text);
    } catch (error) {
      console.error("Error testing plan generation:", error.message);
    }

    console.log(`\n✅ Testing echo tool...`);
    try {
      const echoResult = await client.callTool("echo", {
        message: "Health & Fitness Coach MCP is working!"
      });
      console.log("Echo result:");
      console.log(echoResult.content[0].text);
    } catch (error) {
      console.error("Error testing echo:", error.message);
    }
  }

  client.close();
}

main(); 