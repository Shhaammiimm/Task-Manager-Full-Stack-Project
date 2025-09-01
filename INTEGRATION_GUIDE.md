# Integration Guide - Frontend & Backend

This guide explains how the frontend and backend components work together to create a complete todo list application.

## 🔗 Architecture Overview

The application follows a **client-server architecture** where:

- **Backend (Node.js/Express)**: Provides RESTful API endpoints
- **Frontend (HTML/CSS/JavaScript)**: Consumes the API and provides user interface
- **Database (MongoDB)**: Stores user and task data
- **Authentication (JWT)**: Secures API endpoints

## 🌐 API Integration

### Base Configuration
The frontend connects to the backend via the `API_BASE_URL` constant in `frontend/js/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Authentication Flow
1. **Registration**: User creates account → Backend stores user data → Frontend shows login form
2. **Login**: User provides credentials → Backend validates → Returns JWT token → Frontend stores token
3. **API Calls**: Frontend includes JWT token in Authorization header for authenticated requests
4. **Logout**: Frontend clears stored token → User redirected to login

### Request/Response Pattern
All API calls follow this pattern:

```javascript
// Frontend makes request
const response = await fetch(`${API_BASE_URL}/endpoint`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // For authenticated requests
    },
    body: JSON.stringify(data)
});

// Backend processes and responds
const result = await response.json();
```

## 📡 API Endpoints Integration

### Authentication Endpoints

| Frontend Action | API Endpoint | Method | Description |
|----------------|--------------|--------|-------------|
| User Registration | `/api/Registration` | POST | Create new user account |
| User Login | `/api/Login` | POST | Authenticate user |
| Email Verification | `/api/EmailVerify/{email}` | GET | Send reset code |
| Password Reset | `/api/ResetPassword` | POST | Reset password with code |

### Task Management Endpoints

| Frontend Action | API Endpoint | Method | Description |
|----------------|--------------|--------|-------------|
| Create Task | `/api/CreateTask` | POST | Add new task |
| Get Tasks | `/api/TaskListByStatus/{status}` | GET | Retrieve tasks by status |
| Update Status | `/api/UpdateTaskStatus/{id}/{status}` | PATCH | Change task status |
| Delete Task | `/api/DeleteTask/{id}` | DELETE | Remove task |
| Task Count | `/api/CountTask` | GET | Get task statistics |

## 🔐 Security Integration

### JWT Token Management
- **Storage**: Tokens stored in browser's localStorage
- **Transmission**: Included in Authorization header for API requests
- **Validation**: Backend middleware validates tokens before processing requests
- **Expiration**: Tokens expire and user is logged out automatically

### CORS Configuration
Backend allows frontend requests through CORS middleware:

```javascript
app.use(cors());
```

### Rate Limiting
Backend protects against abuse with rate limiting:

```javascript
const limiter = rateLimit({
    windowMs: REQUEST_TIME,
    max: REQUEST_NUMBER
});
app.use(limiter);
```

## 🎨 Frontend-Backend Data Flow

### 1. User Authentication Flow
```
Frontend Form → API Request → Backend Validation → JWT Token → Frontend Storage
```

### 2. Task Creation Flow
```
Frontend Form → API Request → Backend Processing → Database Storage → Success Response → UI Update
```

### 3. Task Management Flow
```
User Action → API Request → Backend Processing → Database Update → Response → UI Refresh
```

## 🔄 Real-time Updates

The frontend provides real-time feedback through:

1. **Loading States**: Show spinner during API calls
2. **Toast Notifications**: Display success/error messages
3. **Immediate UI Updates**: Refresh data after successful operations
4. **Error Handling**: Show user-friendly error messages

## 📱 Responsive Design Integration

The frontend adapts to different screen sizes:

- **Desktop**: Full dashboard with sidebar and main content
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked layout with touch-friendly buttons

## 🚀 Development Workflow

### Local Development
1. Start backend: `npm run dev` (runs on port 3000)
2. Start frontend: `cd frontend && npm start` (runs on port 8000)
3. Access application: `http://localhost:8000`

### Production Deployment
1. Deploy backend to hosting service (Heroku, AWS, etc.)
2. Update `API_BASE_URL` in frontend to production URL
3. Deploy frontend to static hosting (Netlify, Vercel, etc.)

## 🔧 Configuration Management

### Environment Variables
Backend uses `.env` file for configuration:
```env
PORT=3000
DATABASE=mongodb://localhost:27017/todolist
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### Frontend Configuration
Frontend configuration is in `frontend/js/app.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🐛 Debugging Integration Issues

### Common Issues and Solutions

1. **CORS Errors**
   - Ensure backend CORS is properly configured
   - Check if frontend URL is allowed

2. **Authentication Failures**
   - Verify JWT token is being sent correctly
   - Check token expiration
   - Ensure backend JWT_SECRET is set

3. **API Connection Issues**
   - Verify API_BASE_URL is correct
   - Check if backend server is running
   - Ensure ports are not blocked

4. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check if database server is running
   - Ensure network connectivity

### Debug Tools
- **Browser Developer Tools**: Check network requests and console errors
- **Backend Logs**: Monitor server console for errors
- **API Testing**: Use Postman or similar tools to test endpoints

## 📊 Performance Considerations

### Frontend Optimization
- **CDN Resources**: Tailwind CSS and Font Awesome loaded from CDN
- **Minimal JavaScript**: Vanilla JS for better performance
- **Efficient DOM Updates**: Only update necessary elements

### Backend Optimization
- **Database Indexing**: Proper MongoDB indexes for queries
- **Rate Limiting**: Prevent API abuse
- **Caching**: ETag support for static resources

## 🔮 Future Integration Enhancements

### Planned Features
- **WebSocket Integration**: Real-time task updates
- **File Upload**: Task attachments
- **Push Notifications**: Browser notifications for reminders
- **Offline Support**: Service worker for offline functionality
- **PWA Features**: Installable web app

### Scalability Considerations
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Distribute data across multiple databases
- **CDN Integration**: Serve static assets globally
- **Microservices**: Split backend into smaller services

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
