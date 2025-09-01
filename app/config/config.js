export const PORT=5000;
export const DATABASE='mongodb://127.0.0.1:27017/taskmanager';
export const JWT_KEY='YourJWTSecretKey';
export const JWT_EXPIRE_TIME='30d'; // 7 days

// export const EMAIL_HOST='shamim.com';
// export const EMAIL_PORT=25;
// export const EMAIL_SECURITY=false; // true for 465, false for other ports
// export const EMAIL_USER="shamimahmud433@gmail.com";
// export const EMAIL_PASS="shamim@123";

export const WEB_CACHE=false; // true or false
export const MAX_JSON_SIZE='10mb'; // maximum size of JSON payload
export const URL_ENCODE=true;   // true or false

export const REQUEST_TIME=20*600*1000; // 20 minutes in milliseconds
export const REQUEST_NUMBER=2000; // maximum number of requests per windowMs
