import { TokenDecode } from "../utility/tokenUtility.js";

export default function AuthMiddleware(req, res, next) {
    
    let token = req.headers['token'] || req.headers['authorization']?.replace('Bearer ', '');
    let decode=TokenDecode(token);
    if(!decode){
        return res.status(401).json({status:"fail","Message":"Unauthorized Access"});
    }
    let email=decode['email'];
    let user_id=decode['user_id'];
    req.headers.email=email;
    req.headers.user_id=user_id;
    next();
  }