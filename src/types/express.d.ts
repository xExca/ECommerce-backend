import { UserType } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: Document<unknown, {}, UserType> & UserType;
    }
  }
}