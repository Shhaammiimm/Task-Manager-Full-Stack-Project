import jwt from "jsonwebtoken";
import { JWT_KEY, JWT_EXPIRE_TIME } from "../config/config.js";

export const TokenEncode = (email, user_id) => {
  const token = jwt.sign({ email, user_id }, JWT_KEY, { expiresIn: JWT_EXPIRE_TIME });
  return token;
};

export const TokenDecode = (token) => {
  try {
    return jwt.verify(token, JWT_KEY);
  } catch (err) {
    return null;
  }
};
