/* eslint-disable */
// @ts-nocheck

import { ObjectId } from "mongodb";
import {
  AddLocationDTOSchema,
  DeleteLocationDTOSchema,
} from "./location.schema";

describe("Location Schema", () => {
  describe("AddLocationDTOSchema", () => {
    it("should validate a valid location", () => {
      const data = { latitude: "45", longitude: "90" };
      const result = AddLocationDTOSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should invalidate an out-of-range latitude", () => {
      const data = { latitude: "200", longitude: "90" };
      const result = AddLocationDTOSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should invalidate an out-of-range longitude", () => {
      const data = { latitude: "45", longitude: "200" };
      const result = AddLocationDTOSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("DeleteLocationDTOSchema", () => {
    it("should validate a valid ObjectId", () => {
      const data = { id: new ObjectId().toString() };
      const result = DeleteLocationDTOSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should invalidate an invalid ObjectId", () => {
      const data = { id: "invalid" };
      const result = DeleteLocationDTOSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
