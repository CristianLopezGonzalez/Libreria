import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import {config} from "./env";
const adapter = new PrismaLibSql({
  url: config.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

