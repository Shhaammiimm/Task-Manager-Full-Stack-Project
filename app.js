import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { 
    DATABASE,
    MAX_JSON_SIZE,
    PORT,
    WEB_CACHE,
    REQUEST_TIME,
    REQUEST_NUMBER,
     } from "./app/config/config.js";

import router from "./routes/api.js";

const app=express();

//App use default middlewares
app.use(cors());
app.use(helmet());
app.use(express.json({limit:MAX_JSON_SIZE}));
app.use(express.urlencoded({ extended: true, limit: MAX_JSON_SIZE }));

//App use rate limit
const limiter = rateLimit({
    windowMs: REQUEST_TIME, // 20 minutes
    max: REQUEST_NUMBER // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.set('etag', WEB_CACHE); // enable or disable etag

//Database connection
mongoose.connect(DATABASE, {autoIndex:true}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log("Database connection error: ", err);
}); 

app.use("/api",router);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

