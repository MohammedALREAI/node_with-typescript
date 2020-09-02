import "reflect-metadata";
import { IContext } from "./Types/types";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./Consts";
import "reflex-metadata";
import express from "express";
const PORT: number = Number(process.env.PORT) | 4000;

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { UserResolver } from "./Resolvers/UserReslover";
import { PostResolver } from "./Resolvers/PostReslover";
import micrOrmConfig from "./mikro-orm.config";
const main = async () => {
  const orm = await MikroORM.init(micrOrmConfig);

  const app: express.Express = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: "some ssecret data",
      cookie: {
        maxAge: Number(1000 * 24 * 60 * 60 * 30),
        secure: _prod_,
        httpOnly: true,
        sameSite: "lax",
      },
      resave: true,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): IContext => ({ req, em: orm.em, res }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen((PORT) => {
    console.log(`the server running in the port http:localhost:${PORT}`);
  });
};

main().catch((err) => {
  new Error("the sets");
});
