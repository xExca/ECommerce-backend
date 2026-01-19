import { Redis } from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // Redis host
  port: 6379,        // Redis port
  // password: "yourpassword", // optional
});

async function testRedis() {
  try {
    await redis.set("test-key", "Test value");
    const value = await redis.get("test-key");

    console.log("Redis connection successful:", Boolean(value));
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
}

testRedis();

export default redis;
