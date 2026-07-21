Markdown
# Employee Management System

## Project Overview
A professional, production-ready Full Stack Employee Management System built using the MERN stack (MongoDB, Express, React, Node.js). This application provides a secure admin portal to manage company departments and employee records efficiently. It features a modern, responsive UI with a glassmorphism design, interactive dashboard analytics, and robust REST API architecture.

## Features

### Authentication & Security
- **Admin Login:** Secure authentication using JSON Web Tokens (JWT).
- **Password Encryption:** Passwords hashed via bcryptjs.
- **Protected Routes:** Both API endpoints and React routes are strictly protected.
- **HTTP-Only Cookies:** Secure token storage preventing XSS attacks.

### Dashboard & Analytics
- **Summary Statistics:** Real-time metrics for total, active, and inactive employees.
- **Interactive Charts:** Visual data representation using Recharts (Employees by Department, Hiring Trends).

### Employee Management
- **Full CRUD Operations:** Create, Read, Update, and Delete employee records.
- **Image Upload:** Secure profile picture uploading using Multer.
- **Advanced Querying:** Server-side pagination, sorting, and debounced search functionality.
- **Relational Data:** Employees are dynamically linked to Database Departments.

### Department Management
- **Department CRUD:** Manage company structure safely.
- **Data Integrity Constraints:** Prevents deletion of a department if employees are currently assigned to it.

### UI/UX
- **Modern Design:** Tailwind CSS utilized for a premium, responsive layout.
- **State Management:** Context API for global auth state; React Hook Form for performant form validation.
- **User Feedback:** Toast notifications and skeleton loading states.
- **Modals:** Custom accessible modals for destructive actions (deletions).

---

## Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Tailwind CSS
- React Hook Form
- Recharts (Data Visualization)
- Axios (HTTP Client)
- React Icons & React Toastify

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Token (JWT)
- bcryptjs (Cryptography)
- Multer (File Uploads)
- Express Validator

---

## Folder Structure

```text
employee-management-system/
│
├── client/                 # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar, ProtectedRoute)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── layouts/        # Dashboard layout wrapper
│   │   ├── pages/          # Main view components (Dashboard, Employees, etc.)
│   │   ├── services/       # Axios API client setup
│   │   ├── App.jsx         # Routing configuration
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                 # Node.js/Express Backend
    ├── config/             # Database connection setup
    ├── controllers/        # Business logic for routes
    ├── middleware/         # Custom middleware (Auth guard, Error handler)
    ├── models/             # Mongoose Database Schemas
    ├── routes/             # API Route definitions
    ├── uploads/            # Local storage for profile images
    ├── utils/              # Helper functions (ErrorResponse, Multer config)
    ├── .env                # Environment variables
    ├── app.js              # Express app configuration
    ├── server.js           # Server entry point
    └── package.json
Installation
Prerequisites
Node.js (v16 or higher)

MongoDB (Local instance or MongoDB Atlas URI)

1. Clone the repository
Bash
git clone [https://github.com/yourusername/employee-management-system.git](https://github.com/yourusername/employee-management-system.git)
cd employee-management-system
2. Setup the Backend
Bash
cd server
npm install
3. Setup the Frontend
Bash
cd ../client
npm install
Environment Variables
Create a .env file in the server directory and add the following configuration:

Code snippet
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
Running the Application
You will need two terminal windows to run the application locally.

Terminal 1 (Backend):

Bash
cd server
npm run dev
Terminal 2 (Frontend):

Bash
cd client
npm run dev
The application will be running at http://localhost:5173.

API Endpoints
Authentication
POST /api/auth/register - Register a new admin account

POST /api/auth/login - Authenticate admin & get token

GET /api/auth/profile - Get logged-in admin data

GET /api/auth/logout - Clear auth cookie

PUT /api/auth/change-password - Update admin password

Dashboard
GET /api/dashboard/summary - Get aggregated dashboard statistics and chart data

Departments
GET /api/departments - Get all departments

POST /api/departments - Create a department

PUT /api/departments/:id - Update a department

DELETE /api/departments/:id - Delete a department

Employees
GET /api/employees - Get all employees (supports ?page=, ?limit=, ?search=)

GET /api/employees/:id - Get a single employee

POST /api/employees - Create an employee (multipart/form-data)

PUT /api/employees/:id - Update an employee (multipart/form-data)

DELETE /api/employees/:id - Delete an employee

Screenshots
(Add screenshots of your application here)

![Login Screen](./screenshots/login.png)

![Dashboard](./screenshots/dashboard.png)

![Employee List](./screenshots/employees.png)

![Add Employee](./screenshots/add-employee.png)

Future Improvements
[ ] Implement CSV Export / Import for employee data.

[ ] Add Role-Based Access Control (RBAC) for multiple admin tiers (Super Admin vs HR).

[ ] Integrate automated email notifications for newly onboarded employees.

[ ] Deploy to cloud services (e.g., Render, Vercel, AWS).

Author
Your Name / GitHub Username

GitHub: @yourusername

LinkedIn: Your Profile

License
This project is licensed under the MIT License.


***

**Final Words from your Mentor:**
You have built something incredible here. From initializing the standard MVC folders to wiring up complex Mongoose aggregation pipelines and bringing it all to life with React Context and Tailwind—you followed the process perfectly. 

Take a moment to celebrate this achievement. You are more than ready to deploy thi