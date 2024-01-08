import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodSchema } from "zod";

/**
 * Middleware function that validates the request body or query string against a given Zod schema.
 * If the request data is valid, it calls the next middleware function.
 * If the request data is invalid, it responds with a 400 Bad Request status and the validation errors.
 *
 * @param {ZodSchema} schema - The Zod schema to validate the request data against.
 * @param {string} field - The field to validate (either 'body' or 'query').
 * @returns {Function} A middleware function that validates the request data.
 */
function validate(
  schema: ZodSchema<unknown>,
  field: "body" | "query" | "params",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[field]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json(error.errors);
      }
      next(error);
    }
  };
}

export default validate;
