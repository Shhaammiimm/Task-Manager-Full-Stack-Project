import { TokenDecode } from "../utility/tokenUtility.js";

export default function AuthMiddleware(req, res, next) {
  const token =
    req.headers["token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");

  const decode = TokenDecode(token);

  if (!decode) {
    return res.status(401).json({ status: "fail", Message: "Unauthorized Access" });
  }

  req.user = {
    _id: decode.user_id,
    email: decode.email,
  };

  next();
}

