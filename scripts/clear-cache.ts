import "dotenv/config";
import { redis } from "../src/lib/redis";

async function main() {
    console.log("Clearing store_settings cache...");
    await redis.del("store_settings");
    console.log("Cache cleared successfully.");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        // process.exit(0); // If needed
    });
