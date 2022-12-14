declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      DISCORD_BOT_TOKEN: string;
      CYPHER_KEY: string;
      NAME_2FA: string;
    }
  }
}

export {};
