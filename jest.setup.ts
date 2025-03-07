import { execSync } from 'child_process'
import knex from "knex";

const config = require("./knexfile").test;
const db = knex(config);

const clearDB = async () => {
  console.log("🧹 Cleaning up test database...");
  const tables = await db.raw(`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' AND tablename NOT LIKE 'knex_%'
  `);

  await db.transaction(async (trx) => {
    try {
      await trx.raw("SET session_replication_role = 'replica';");
      for (const { tablename } of tables.rows) {
        await trx.raw(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
      }
      await trx.raw("SET session_replication_role = 'origin';");
      await trx.commit();
    } catch (err) {
      console.error("❌ Error in transaction:", err);
      await trx.rollback();
    }
  });

  console.log("✅ Database cleaned!");
};


const closeDB = async () => {
  console.log("🔌 Closing database connection")
  await db.destroy();
};

const startContainers = () => {
  console.log('🚀 Starting test containers...')
  try {
    execSync('docker compose -f docker-compose.test.yml up -d', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ Failed to start containers:', error)
    process.exit(1)
  }
};

const runMigrations = () => {
  console.log('📜 Running database migrations...');
  try {
    execSync('npx knex migrate:latest', { stdio: 'inherit' })
    //execSync('npx knex seed:run', { stdio: 'inherit' }) -> no seeds for now
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
};

const stopContainers = () => {
  console.log('🛑 Stopping test containers...');
  try {
    execSync('docker compose -f docker-compose.test.yml down', { stdio: 'inherit' })
  } catch (error) {
    console.error('⚠️ Failed to stop containers:', error)
  }
};

beforeEach(async () => {
  await clearDB()
});

beforeAll(async () => {
  stopContainers()
  startContainers()
  await runMigrations() 
});

afterAll(async () => {
  await closeDB()
  await stopContainers()
});
