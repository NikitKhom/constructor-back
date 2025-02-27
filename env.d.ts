declare namespace NodeJS {
    interface ProcessEnv {
      USER: string;
      DB_URL: string;
      DB_NAME: string;
      PASS: string;
      PORT: string;
      NODE_ENV: string;
      JWT_SECRET: string;
    }
  }
  