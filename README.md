# Task Manager - Full Stack Todo List Application

A complete full-stack todo list application with user authentication, task management, and a modern responsive UI.

## 🚀 Features

### Backend Features
- **User Authentication**: Registration, login, password reset with email verification
- **Task Management**: Create, read, update, delete tasks
- **Task Status Management**: Pending, Completed, Cancelled statuses
- **User Profile Management**: View and update profile details
- **Security**: JWT authentication, rate limiting, CORS protection
- **Database**: MongoDB with Mongoose ODM

### Frontend Features
- **Modern UI**: Built with Tailwind CSS and Font Awesome icons
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback for all operations
- **Task Filtering**: Filter tasks by status (All, Pending, Completed, Cancelled)
- **Statistics Dashboard**: Visual representation of task counts
- **Toast Notifications**: User-friendly success/error messages
- **Loading States**: Smooth loading indicators

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email functionality
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **HTML5** - Markup
- **Tailwind CSS** - Styling framework
- **Vanilla JavaScript** - Frontend logic
- **Font Awesome** - Icons
- **Fetch API** - HTTP requests

## 📁 Project Structure

```
TODOLIST/
├── app/
│   ├── config/
│   │   └── config.js          # Configuration settings
│   ├── controller/
│   │   ├── TaskController.js  # Task-related API endpoints
│   │   └── UsersController.js # User-related API endpoints
│   ├── middlewares/
│   │   └── AuthMiddleware.js  # JWT authentication middleware
│   ├── model/
│   │   ├── TaskModel.js       # Task database schema
│   │   └── UsersModel.js      # User database schema
│   └── utility/
│       ├── emailUtility.js    # Email sending functionality
│       └── tokenUtility.js    # JWT token management
├── frontend/
│   ├── index.html             # Main HTML file
│   └── js/
│       └── app.js             # Frontend JavaScript logic
├── routes/
│   └── api.js                 # API route definitions
├── app.js                     # Main server file
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TODOLIST
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
       PORT=5000
   DATABASE=mongodb://localhost:27017/todolist
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   MAX_JSON_SIZE=10mb
   WEB_CACHE=true
   REQUEST_TIME=1200000
   REQUEST_NUMBER=100
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Open the frontend**
   - Navigate to the `frontend` folder
   - Open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     cd frontend
     npm start
     # Then open http://localhost:8000
     ```

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/Registration
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123"
}
```

#### Login
```
POST /api/Login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password
```
GET /api/EmailVerify/{email}
```

#### Reset Password
```
POST /api/ResetPassword
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456",
  "password": "newpassword123"
}
```

### Task Endpoints

#### Create Task
```
POST /api/CreateTask
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo list application",
  "status": "pending"
}
```

#### Get Tasks by Status
```
GET /api/TaskListByStatus/{status}
Authorization: Bearer <token>
```

#### Update Task Status
```
PATCH /api/UpdateTaskStatus/{taskId}/{status}
Authorization: Bearer <token>
```

#### Delete Task
```
DELETE /api/DeleteTask/{taskId}
Authorization: Bearer <token>
```

#### Get Task Count
```
GET /api/CountTask
Authorization: Bearer <token>
```

## 🎨 Frontend Features

### User Interface
- **Clean Design**: Modern, minimalist interface
- **Responsive Layout**: Adapts to different screen sizes
- **Color-coded Status**: Visual indicators for task status
- **Interactive Elements**: Hover effects and smooth transitions

### User Experience
- **Intuitive Navigation**: Easy switching between forms
- **Real-time Feedback**: Immediate response to user actions
- **Error Handling**: Clear error messages and validation
- **Loading States**: Visual feedback during API calls

### Task Management
- **Quick Actions**: One-click status updates
- **Bulk Operations**: Filter and manage multiple tasks
- **Search & Filter**: Find tasks by status
- **Statistics**: Overview of task distribution

## 🔧 Configuration

### Backend Configuration
The application uses environment variables for configuration. Key settings include:

- `PORT`: Server port (default: 3000)
- `DATABASE`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER` & `EMAIL_PASS`: Email credentials for password reset
- `REQUEST_TIME` & `REQUEST_NUMBER`: Rate limiting settings

### Frontend Configuration
The frontend connects to the backend via the `API_BASE_URL` constant in `app.js`. Update this if your backend runs on a different port or host.

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Upload the `frontend` folder to your web server
2. Update the `API_BASE_URL` in `app.js` to point to your backend
3. Ensure CORS is properly configured on the backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue in the repository

## 🔮 Future Enhancements

- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] File attachments
- [ ] Team collaboration
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Advanced search and filtering
- [ ] Task templates
- [ ] Export/import functionality
- [ ] Real-time notifications
