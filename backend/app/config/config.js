import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DATABASE = process.env.DATABASE 
export const JWT_KEY = process.env.JWT_KEY || "YourJWTSecretKey";
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || "30d";

export const WEB_CACHE = false;
export const MAX_JSON_SIZE = "10mb";
export const URL_ENCODE = true;

export const REQUEST_TIME = 20 * 600 * 1000;
export const REQUEST_NUMBER = 2000;
