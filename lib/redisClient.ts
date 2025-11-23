import { createClient, RedisClientType } from "redis";

type RedisClient = RedisClientType<Record<string, never>, Record<string, never>, Record<string, never>>;

const globalForRedis = globalThis as typeof globalThis & {
  __redisClient?: RedisClient;
  __redisClientPromise?: Promise<RedisClient>;
};

const getRedisConfig = () => {
  const {
    REDIS_URL,
    REDIS_USERNAME,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_USE_TLS,
  } = process.env;

  if (!REDIS_URL && !REDIS_HOST) {
    throw new Error(
      "Redis configuration is missing. Provide either REDIS_URL or REDIS_HOST/REDIS_PORT.",
    );
  }

  const socketConfig =
    REDIS_URL && !REDIS_HOST
      ? undefined
      : {
          host: REDIS_HOST,
          port: REDIS_PORT ? Number(REDIS_PORT) : undefined,
          tls: REDIS_USE_TLS === "true" ? {} : undefined,
        };

  return {
    url: REDIS_URL,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: socketConfig,
  };
};

export async function getRedisClient(): Promise<RedisClient> {
  if (globalForRedis.__redisClient && globalForRedis.__redisClient.isOpen) {
    return globalForRedis.__redisClient;
  }

  if (globalForRedis.__redisClientPromise) {
    return globalForRedis.__redisClientPromise;
  }

  const client = createClient(getRedisConfig());

  client.on("error", (err) => {
    console.error("[Redis] Client error", err);
  });

  const connectPromise = client
    .connect()
    .then(() => {
      globalForRedis.__redisClient = client;
      return client;
    })
    .catch((error) => {
      globalForRedis.__redisClientPromise = undefined;
      throw error;
    });

  globalForRedis.__redisClientPromise = connectPromise;
  return connectPromise;
}

export async function disconnectRedis() {
  if (globalForRedis.__redisClient && globalForRedis.__redisClient.isOpen) {
    await globalForRedis.__redisClient.quit();
    globalForRedis.__redisClient = undefined;
    globalForRedis.__redisClientPromise = undefined;
  }
}
