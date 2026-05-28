import { createMcpHandler } from "@vercel/mcp-adapter";
import { getRedisUrl, isRedisAvailable } from "../../lib/redis";
import {
  echoTool,
  workoutLoggerTool,
  nutritionLoggerTool,
  feedbackLoggerTool,
  planGeneratorTool,
  contextViewerTool,
  targetSetterTool,
} from "../../tools";

const handler = createMcpHandler(
  async (server) => {
    console.log("🚀 Initializing MCP Health & Fitness Coach Tools...");
    
    // Health & Fitness Coach Tools
    server.tool(
      workoutLoggerTool.name,
      workoutLoggerTool.description,
      workoutLoggerTool.schema,
      workoutLoggerTool.handler
    );

    server.tool(
      nutritionLoggerTool.name,
      nutritionLoggerTool.description,
      nutritionLoggerTool.schema,
      nutritionLoggerTool.handler
    );

    server.tool(
      feedbackLoggerTool.name,
      feedbackLoggerTool.description,
      feedbackLoggerTool.schema,
      feedbackLoggerTool.handler
    );

    server.tool(
      planGeneratorTool.name,
      planGeneratorTool.description,
      planGeneratorTool.schema,
      planGeneratorTool.handler
    );

    server.tool(
      contextViewerTool.name,
      contextViewerTool.description,
      contextViewerTool.schema,
      contextViewerTool.handler
    );

    server.tool(
      targetSetterTool.name,
      targetSetterTool.description,
      targetSetterTool.schema,
      targetSetterTool.handler
    );

    // Keep echo tool for testing
    server.tool(
      echoTool.name,
      echoTool.description,
      echoTool.schema,
      echoTool.handler
    );

    console.log("✅ MCP Tools registered successfully!");
  },
  {},
  {
    verboseLogs: true,
    maxDuration: 60,
    ...(isRedisAvailable() && { redisUrl: getRedisUrl() }),
  }
);

export { handler as GET, handler as POST, handler as DELETE }; 