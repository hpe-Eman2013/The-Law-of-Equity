import { Types } from "mongoose";
import { HttpError } from "./errors";
export default function toObjectId(value: unknown, fieldName: string): Types.ObjectId {
  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string.`);
  }
  if (!Types.ObjectId.isValid(value)) {
    throw new HttpError(400, `${fieldName} is not a valid ObjectId.`);
  }
  // avoids deprecated constructor signatures + overload issues
  return Types.ObjectId.createFromHexString(value);
}