import { Client, Databases } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6a2b39150026446eadf0";
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || "health_fitness_coach";

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

if (apiKey) {
    client.setKey(apiKey);
} else {
    console.warn("⚠️ APPWRITE_API_KEY is not defined. Server-side Appwrite requests may fail.");
}

const serverDatabases = new Databases(client);

export { client as serverClient, serverDatabases, databaseId };
