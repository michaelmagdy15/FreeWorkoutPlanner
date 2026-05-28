import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "debug-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  try {
    await client.connect(transport);
    console.log("✅ Connected to MCP server");

    // List tools first
    console.log("\n📋 Listing tools...");
    const tools = await client.listTools();
    console.log("Found tools:", tools.tools.map(t => t.name));

    // Test echo tool with detailed error handling
    console.log("\n🔧 Testing echo tool...");
    try {
      console.log("Calling echo with parameters:", { message: "Hello Debug!" });
      const echoResult = await client.callTool("echo", {
        message: "Hello Debug!",
      });
      console.log("✅ Echo success:", echoResult);
    } catch (echoError) {
      console.log("❌ Echo failed:");
      console.log("Error message:", echoError.message);
      console.log("Error stack:", echoError.stack);
      if (echoError.cause) {
        console.log("Error cause:", echoError.cause);
      }
    }

    // Test workout logging with detailed error handling
    console.log("\n🏃‍♀️ Testing workout tool...");
    try {
      const workoutParams = {
        userId: "debug-user",
        date: "2025-01-07",
        type: "running",
        duration: 30,
        distance: 5.0
      };
      console.log("Calling log-workout with parameters:", workoutParams);
      const workoutResult = await client.callTool("log-workout", workoutParams);
      console.log("✅ Workout success:", workoutResult);
    } catch (workoutError) {
      console.log("❌ Workout failed:");
      console.log("Error message:", workoutError.message);
      console.log("Error stack:", workoutError.stack);
      if (workoutError.cause) {
        console.log("Error cause:", workoutError.cause);
      }
    }

  } catch (error) {
    console.error("❌ Connection error:", error);
  } finally {
    client.close();
  }
}

main(); 