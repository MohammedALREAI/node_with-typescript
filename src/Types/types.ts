import { Request, Response } from "express";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
export type IContext = {
  req: Request;
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  res: Response;
};


