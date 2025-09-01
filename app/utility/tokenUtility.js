import jwt from 'jsonwebtoken'
import {JWT_KEY,JWT_EXPIRE_TIME} from '../config/config.js'

export const TokenEncode=(email,user_id)=>{
   let KEY=JWT_KEY;
   let EXPIRE=JWT_EXPIRE_TIME;
   let PAYLOAD={email:email,user_id:user_id};
   let token = jwt.sign(PAYLOAD, KEY, { expiresIn: EXPIRE });
   return token;
}
export const TokenDecode=(token)=>{
    let KEY=JWT_KEY;
    try{
        let decode=jwt.verify(token,KEY);
        return decode;
    }
    catch(err){
        return null;
    }

}