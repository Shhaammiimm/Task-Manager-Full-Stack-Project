import TaskModel from "../model/TaskModel.js";
import mongoose from "mongoose";
export const CreateTask=async(req,res)=>{
    
    try{
        let reqBody=req.body;
        reqBody['user_id']=req.headers.user_id;
        await TaskModel.create(reqBody);
        return res.status(200).json({status:"success","Message":"CreateTask",Data:reqBody});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}
export const UpdateTask=async(req,res)=>{
    try{
        let id=req.params.id;
        let reqBody=req.body;
        let user_id=req.headers.user_id;
        let task=await TaskModel.findOneAndUpdate({_id:id,user_id:user_id},reqBody,{new:true});
        if(!task){
            return res.status(400).json({status:"fail","Message":"Task Not Found"});
        }
        return res.status(200).json({status:"success","Message":"UpdateTask",Data:task});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}

export const UpdateTaskStatus=async(req,res)=>{
    try{
        let id=req.params.id;
        let status=req.params.status;
        let user_id=req.headers.user_id;
        let task=await TaskModel.findOneAndUpdate({_id:id,user_id:user_id},{status:status},{new:true});
        if(!task){
            return res.status(400).json({status:"fail","Message":"Task Not Found"});
        }
        return res.status(200).json({status:"success","Message":"UpdateTaskStatus",Data:task});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}
export const TaskListByStatus=async(req,res)=>{
    try{
        let status=req.params.status;
        let user_id=req.headers.user_id;
        let task=await TaskModel.find({status:status,user_id:user_id});
        if(!task){
            return res.status(400).json({status:"fail","Message":"Task Not Found"});
        }
        return res.status(200).json({status:"success","Message":"TaskListByStatus",Data:task});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}
export const DeleteTask=async(req,res)=>{
    try{
        let id=req.params.id;
        let user_id=req.headers.user_id;
        let task=await TaskModel.findOneAndDelete({_id:id,user_id:user_id});
        if(!task){
            return res.status(400).json({status:"fail","Message":"Task Not Found"});
        }
        return res.status(200).json({status:"success","Message":"DeleteTask",Data:task});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}
export const CountTask=async(req,res)=>{
    try{
        let user_id=req.headers.user_id;
        let object_id=mongoose.Types.ObjectId;
        let user_id_obj= new object_id(user_id);
        let task=await TaskModel.aggregate([
            {$match:{user_id:user_id_obj}},
            {$group:{_id:"$status",count:{$sum:1}}}
        ]);
        return res.status(200).json({status:"success","Message":"CountTask",Data:task});
    }
    catch(err){
        return res.status(400).json({status:"fail",Message:err.message});
    }
}