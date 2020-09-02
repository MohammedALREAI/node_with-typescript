import { _prod_ } from "./Consts";
import { Post } from "./Entities/Posts";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "/migrations"), // path to folder with migration files
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: "myDbName",
  entities: [Post],
  type: "postgresql",
  debug: !_prod_,
} as Parameters<typeof MikroORM.init>[0];
