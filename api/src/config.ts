import Knex from "knex";

export const port = process.env.PORT || "4000";

export const database: { [env: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./development.sqlite",
    },
    useNullAsDefault: true,
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    useNullAsDefault: true,
  },
  production: {
    client: process.env.DATABASE_DRIVER,
    connection:
      process.env.DATABASE_DRIVER === "sqlite"
        ? {
            filename: "./production.sqlite",
          }
        : {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          },
    useNullAsDefault: true,
  },
};

export const environment = process.env.NODE_ENV || "development";

export const auth = {
  disabled: process.env.AUTH_DISABLED === "true",
  proxy: {
    enabled: process.env.PROXY_AUTH === "true",
    header: process.env.PROXY_AUTH_HEADER || "x-forwarded-email",
  },
  api: {
    enabled: process.env.API_AUTH === "true",
    key: process.env.API_KEY || "",
  },
  jwt: {
    enabled: process.env.JWT_AUTH === "true",
    secret: process.env.JWT_SECRET,
  },
  basic: {
    enabled: process.env.BASIC_AUTH === "true",
    password: process.env.BASIC_PASSWORD,
  },
};

export const APP_ROOT = process.env.APP_ROOT || __dirname;

export const DEFAULT_CHART =
  process.env.DEFAULT_CHART || "github.com/ColDog/navigator//charts/service";

export const DEFAULT_DEPLOY = "deploy";
