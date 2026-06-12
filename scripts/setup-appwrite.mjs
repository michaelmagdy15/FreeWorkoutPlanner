import { Client, Databases } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.trim().match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}

loadEnvLocal();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a2b39150026446eadf0';
const databaseId = process.env.APPWRITE_DATABASE_ID || 'health_fitness_coach';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('❌ APPWRITE_API_KEY is not defined in .env.local.');
  console.error('Please create an API key in your Appwrite console and add it to .env.local first.');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function main() {
  console.log('🚀 Setting up Appwrite Database...');

  // 1. Create Database if not exists
  try {
    await databases.get(databaseId);
    console.log(`✅ Database "${databaseId}" already exists.`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`⏳ Creating database "${databaseId}"...`);
      await databases.create(databaseId, 'Health & Fitness Coach Database');
      console.log(`✅ Database "${databaseId}" created successfully.`);
    } else {
      throw error;
    }
  }

  // 2. Define collections and attributes
  const collections = [
    {
      id: 'workouts',
      name: 'Workouts',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'type', type: 'string', size: 50, required: true },
        { key: 'duration', type: 'integer', required: true },
        { key: 'sets', type: 'integer', required: false },
        { key: 'reps', type: 'integer', required: false },
        { key: 'weight', type: 'string', size: 100, required: false },
        { key: 'distance', type: 'float', required: false },
        { key: 'caloriesBurned', type: 'integer', required: false },
        { key: 'completed', type: 'boolean', required: true, default: false },
        { key: 'timestamp', type: 'string', size: 100, required: true }
      ],
      indexes: [
        { key: 'idx_workouts_user', type: 'key', attributes: ['userId'] }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'mealType', type: 'string', size: 50, required: true },
        { key: 'foodItem', type: 'string', size: 255, required: true },
        { key: 'calories', type: 'integer', required: true },
        { key: 'protein', type: 'float', required: false },
        { key: 'carbs', type: 'float', required: false },
        { key: 'fat', type: 'float', required: false },
        { key: 'timestamp', type: 'string', size: 100, required: true }
      ],
      indexes: [
        { key: 'idx_nutrition_user', type: 'key', attributes: ['userId'] }
      ]
    },
    {
      id: 'activities',
      name: 'Activities',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'type', type: 'string', size: 50, required: true },
        { key: 'count', type: 'integer', required: false },
        { key: 'amount', type: 'float', required: false },
        { key: 'duration', type: 'integer', required: false },
        { key: 'value', type: 'float', required: false },
        { key: 'unit', type: 'string', size: 50, required: true },
        { key: 'timestamp', type: 'string', size: 100, required: true }
      ],
      indexes: [
        { key: 'idx_activities_user', type: 'key', attributes: ['userId'] }
      ]
    },
    {
      id: 'plans',
      name: 'Plans',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'structuredPlan', type: 'string', size: 20000, required: true },
        { key: 'updatedAt', type: 'string', size: 100, required: true }
      ],
      indexes: [
        { key: 'idx_plans_user', type: 'key', attributes: ['userId'] }
      ]
    },
    {
      id: 'feedback',
      name: 'Feedback',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'type', type: 'string', size: 50, required: true },
        { key: 'notes', type: 'string', size: 5000, required: true },
        { key: 'rating', type: 'integer', required: false },
        { key: 'timestamp', type: 'string', size: 100, required: true }
      ],
      indexes: [
        { key: 'idx_feedback_user', type: 'key', attributes: ['userId'] }
      ]
    }
  ];

  for (const col of collections) {
    try {
      await databases.getCollection(databaseId, col.id);
      console.log(`✅ Collection "${col.id}" already exists.`);
    } catch (error) {
      if (error.code === 404) {
        console.log(`⏳ Creating collection "${col.id}"...`);
        await databases.createCollection(databaseId, col.id, col.name);
        console.log(`✅ Collection "${col.id}" created.`);
      } else {
        throw error;
      }
    }

    // Retrieve the collection to inspect existing attributes
    const collectionInfo = await databases.getCollection(databaseId, col.id);
    const existingAttrKeys = new Set(collectionInfo.attributes.map(a => a.key));

    // Create missing attributes
    let createdAny = false;
    for (const attr of col.attributes) {
      if (existingAttrKeys.has(attr.key)) {
        continue;
      }

      console.log(`⏳ Creating attribute "${col.id}.${attr.key}"...`);
      if (attr.type === 'string') {
        await databases.createStringAttribute(databaseId, col.id, attr.key, attr.size, attr.required, attr.default, false);
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(databaseId, col.id, attr.key, attr.required, null, null, attr.default, false);
      } else if (attr.type === 'float') {
        await databases.createFloatAttribute(databaseId, col.id, attr.key, attr.required, null, null, attr.default, false);
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(databaseId, col.id, attr.key, attr.required, attr.default, false);
      }
      createdAny = true;
    }

    if (createdAny) {
      // Wait for attributes to become available
      await waitForAttributes(databaseId, col.id);
    }

    // Retrieve updated collection info to get indexes
    const updatedCollectionInfo = await databases.getCollection(databaseId, col.id);
    const existingIndexKeys = new Set(updatedCollectionInfo.indexes.map(idx => idx.key));

    // Create missing indexes
    for (const index of col.indexes) {
      if (existingIndexKeys.has(index.key)) {
        continue;
      }

      console.log(`⏳ Creating index "${col.id}.${index.key}"...`);
      try {
        await databases.createIndex(databaseId, col.id, index.key, index.type, index.attributes);
        console.log(`✅ Index "${col.id}.${index.key}" created.`);
      } catch (err) {
        console.error(`❌ Failed to create index "${col.id}.${index.key}":`, err.message);
      }
    }
  }

  console.log('🎉 Appwrite schema setup completed successfully!');
}

async function waitForAttributes(databaseId, collectionId) {
  console.log(`⏳ Waiting for all attributes in "${collectionId}" to be available...`);
  while (true) {
    const col = await databases.getCollection(databaseId, collectionId);
    const pending = col.attributes.filter(a => a.status !== 'available' && a.status !== 'failed');
    if (pending.length === 0) {
      break;
    }
    console.log(`   Waiting on: ${pending.map(a => a.key).join(', ')}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

main().catch(error => {
  console.error('❌ Error during setup:', error);
  process.exit(1);
});
