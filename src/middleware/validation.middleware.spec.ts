/* eslint-disable */
// @ts-nocheck

import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { z } from "zod";

import validate from "./validation.middleware";

describe("validate middleware", () => {
  it("should pass validation for correct data", async () => {
    const schema = z.object({
      name: z.string(),
    });

    const app = express();
    app.use(express.json());
    app.post(
      "/test",
      validate(schema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        res.status(StatusCodes.OK).send("OK"),
    );

    const res = await request(app).post("/test").send({ name: "John Doe" });

    expect(res.status).toBe(StatusCodes.OK);
  });

  it("should fail validation for incorrect data", async () => {
    const schema = z.object({
      name: z.string(),
    });

    const app = express();
    app.use(express.json());
    app.post(
      "/test",
      validate(schema, "body"),
      (req: Request, res: Response, next: NextFunction) =>
        res.status(StatusCodes.OK).send("OK"),
    );

    const res = await request(app).post("/test").send({ name: 123 });

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should handle non-ZodError exceptions", async () => {
    const schema = {
      parse: () => {
        throw new Error("Non-ZodError");
      },
    };

    const app = express();
    app.use(express.json());
    app.post(
      "/test",
      validate(schema as ZodSchema<unknown>, "body"),
      (err: any, req: Request, res: Response, next: NextFunction) =>
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message),
    );

    const res = await request(app).post("/test").send({ name: "John Doe" });

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.text).toBe("Non-ZodError");
  });
});
