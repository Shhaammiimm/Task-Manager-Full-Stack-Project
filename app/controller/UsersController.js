import UsersModel from "../model/UsersModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";
import SendEmail from "../utility/EmailUtility.js";
//Registration
export const Registration=async(req,res)=>{
   // console.log(req.body);
    try{
        let reqBody=req.body;
        await UsersModel.create(reqBody);
        return res.status(200).json({status:"success","Message":"Registration"});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
   
};
export const Login=async(req,res)=>{
    try{
         let reqBody=req.body;
         let user=await UsersModel.findOne(reqBody);
         if(!user){
                return res.status(400).json({status:"fail","Message":"User Not Found"});
         }
         let token=TokenEncode(user['email'],user['_id']);
        // console.log(token);
         return res.status(200).json({status:"success","Message":"Login Successfully",Token:token});
         
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
    return res.status(200).json({status:"success","Message":"Login"})
};
export const ProfileDetails = async (req, res) => {
    try{
        let user_id=req.headers.user_id;
        let user=await UsersModel.findOne({_id:user_id});
        if(!user){
            return res.status(400).json({status:"fail","Message":"User Not Found"});
        }
        return res.status(200).json({status:"success","Message":"Profile Details","Data":user});

    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
};
export const ProfileUpdate=async(req,res)=>{
    try{
        let user_id=req.headers.user_id;
        let reqBody=req.body;
        let user=await UsersModel.findOneAndUpdate({_id:user_id},reqBody);
        return res.status(200).json({status:"success","Message":"Profile Update Successfully","Data":user});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
};
export const EmailVerify = async (req, res) => {
    try {
      const email = req.params.email;
  
      const user = await UsersModel.findOne({ email });
      if (!user) {
        return res.json({ status: "fail", Message: "User email does not exist" });
      }
  
      const code = Math.floor(100000 + Math.random() * 900000);
  
      const sent = await SendEmail(
        user.email,
        "Your verification code is: " + code,
        "Task Manager Verification Code"
      );
  
      if (!sent) {
        return res.json({ status: "fail", Message: "Email sending failed" });
      }
  
      await UsersModel.updateOne({ email }, { otp: code });
  
      return res.json({
        status: "success",
        Message: "Verification successfully, check email",
      });
    } catch (err) {
      return res.json({ status: "fail", Message: err.toString() });
    }
  };
 export const CodeVerify=async(req,res)=>{
    try {
        let email=req.params.email;
        let code=req.params.code;

        let data=await UsersModel.findOne({email: email,otp:code})
        if(data==null){
            return res.json({status:"fail","Message":"Wrong Verification Code"})
        }
        else {
            return res.json({status:"success","Message":"Verification successfully"})
        }
    }catch (e) {
        return res.status(400).json({status:"fail",Message:err.message});
    }
}

export const ResetPassword=async(req,res)=>{

    try {
        let reqBody=req.body;
        let data=await UsersModel.findOne({email: reqBody['email'],otp:reqBody['code']})
        if(data==null){
            return res.json({status:"fail","Message":"Wrong Verification Code"})
        }
        else {
            await UsersModel.updateOne({email: reqBody['email']},{
                otp:"0", password:reqBody['password'],
            })
            return res.json({status:"success","Message":"User ResetPassword successfully"})
        }
    }

    catch (err) {
        return res.status(400).json({status:"fail",Message:err.message});
    }

}

