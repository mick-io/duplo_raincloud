import { z } from "zod";

import {
  DeleteLocationByIdRequestParamsSchema,
  DeleteLocationRequestQuerySchema,
  GetLocationsRequestBodySchema,
  PostLocationRequestBodySchema,
} from "../schemas/request.schema";

export type PostLocationRequestBody = z.infer<
  typeof PostLocationRequestBodySchema
>;
export type GetLocationsRequestBody = z.infer<
  typeof GetLocationsRequestBodySchema
>;

export type DeleteLocationRequestQuery = z.infer<
  typeof DeleteLocationRequestQuerySchema
>;

export type DeleteLocationByIdRequestParams = z.infer<
  typeof DeleteLocationByIdRequestParamsSchema
>;
