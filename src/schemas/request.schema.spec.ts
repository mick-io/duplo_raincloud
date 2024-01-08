import { PostLocationRequestBodySchema } from "./request.schema";
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
} from "../constants";

describe("PostLocationRequestBodySchema", () => {
  it("should accept valid latitude and longitude", () => {
    const validData = {
      latitude: (MIN_LATITUDE + MAX_LATITUDE) / 2,
      longitude: (MIN_LONGITUDE + MAX_LONGITUDE) / 2,
    };

    const result = PostLocationRequestBodySchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject invalid latitude", () => {
    const invalidData = {
      latitude: MAX_LATITUDE + 1,
      longitude: (MIN_LONGITUDE + MAX_LONGITUDE) / 2,
    };

    const result = PostLocationRequestBodySchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should reject invalid longitude", () => {
    const invalidData = {
      latitude: (MIN_LATITUDE + MAX_LATITUDE) / 2,
      longitude: MAX_LONGITUDE + 1,
    };

    const result = PostLocationRequestBodySchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should accept string latitude and longitude and convert them to numbers", () => {
    const validData = {
      latitude: String((MIN_LATITUDE + MAX_LATITUDE) / 2),
      longitude: String((MIN_LONGITUDE + MAX_LONGITUDE) / 2),
    };

    const result = PostLocationRequestBodySchema.safeParse(validData);

    if (result.success) {
      expect(typeof result.data.latitude).toBe("number");
      expect(typeof result.data.longitude).toBe("number");
    }

    expect(result.success).toBe(true);
  });
});
