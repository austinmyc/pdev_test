import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

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

  // If REDIS_URL is provided, use it directly
  if (REDIS_URL && !REDIS_HOST) {
    const config: {
      url: string;
      username?: string;
      password?: string;
    } = {
      url: REDIS_URL,
    };
    
    if (REDIS_USERNAME) config.username = REDIS_USERNAME;
    if (REDIS_PASSWORD) config.password = REDIS_PASSWORD;
    
    return config;
  }

  // Build socket config - conditionally include tls property
  const socketConfigBase: {
    host: string;
    port?: number;
  } = {
    host: REDIS_HOST!,
  };

  if (REDIS_PORT) {
    socketConfigBase.port = Number(REDIS_PORT);
  }

  // Build socket config with conditional TLS
  // For TLS, we need to provide an object, but TypeScript is strict about the type
  // Using a type assertion to satisfy the build-time type checking
  const socketConfig = REDIS_USE_TLS === "true"
    ? {
        ...socketConfigBase,
        tls: {} as any, // Empty object enables TLS with default settings
      }
    : socketConfigBase;

  const config: {
    socket: typeof socketConfig;
    username?: string;
    password?: string;
  } = {
    socket: socketConfig,
  };
  
  if (REDIS_USERNAME) config.username = REDIS_USERNAME;
  if (REDIS_PASSWORD) config.password = REDIS_PASSWORD;

  // Type assertion to satisfy strict TypeScript checking in build environments
  return config as any;
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
