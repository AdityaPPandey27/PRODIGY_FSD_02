<div align="center">

# 💼 Employee Management System

### 🚀 Production-Ready Full Stack MERN Application

A modern **Employee Management System** built using the **MERN Stack** that enables administrators to securely manage employees and departments with a beautiful dashboard, real-time analytics, and enterprise-level architecture.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

### 🌟 Built With

React • Node.js • Express.js • MongoDB • Tailwind CSS • JWT • Multer

</div>

---

# 📑 Table of Contents

- 📌 Project Overview
- ✨ Features
- 🛠 Tech Stack
- 📁 Folder Structure
- ⚙️ Installation
- 🔐 Environment Variables
- ▶️ Running the Project
- 🌐 API Endpoints
- 📸 Screenshots
- 🚀 Future Improvements
- 👨‍💻 Author
- 📄 License

---

# 📌 Project Overview

The **Employee Management System** is a production-ready **Full Stack MERN Application** designed for secure employee and department management.

It provides a premium admin dashboard with:

- 🔐 Secure Authentication
- 👨‍💼 Employee Management
- 🏢 Department Management
- 📊 Interactive Analytics
- 📱 Responsive UI
- ⚡ RESTful API Architecture

---

# ✨ Features

## 🔐 Authentication & Security

- ✅ Secure Admin Login
- 🔑 JWT Authentication
- 🔒 Password Hashing using bcryptjs
- 🍪 HTTP-Only Cookie Authentication
- 🛡 Protected Backend & Frontend Routes

---

## 📊 Dashboard

- 📈 Real-time Employee Statistics
- 👥 Active vs Inactive Employees
- 🏢 Department-wise Distribution
- 📅 Hiring Trends
- 📊 Interactive Charts using Recharts

---

## 👨‍💼 Employee Management

- ➕ Add Employees
- 📝 Update Employee Details
- ❌ Delete Employees
- 🔍 Search Employees
- 📄 Pagination
- ↕ Sorting
- 🖼 Profile Image Upload
- 🔗 Department Relationship

---

## 🏢 Department Management

- Create Departments
- Edit Departments
- Delete Departments
- Data Integrity Validation
- Prevent deleting departments having employees

---

## 🎨 Modern UI

- 🌙 Responsive Layout
- ✨ Glassmorphism Design
- ⚡ Tailwind CSS
- 🔥 React Context API
- 📝 React Hook Form
- 🔔 Toast Notifications
- 💀 Skeleton Loading
- 🪟 Accessible Confirmation Modals

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React (Vite) | Frontend Framework |
| React Router DOM | Routing |
| Tailwind CSS | Styling |
| React Hook Form | Forms |
| Axios | API Requests |
| Recharts | Dashboard Charts |
| React Icons | Icons |
| React Toastify | Notifications |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Server |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Encryption |
| Multer | Image Upload |
| Express Validator | Validation |

---

# 📁 Folder Structure

```text
employee-management-system
│
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── server
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── uploads
    ├── utils
    ├── .env
    ├── app.js
    ├── server.js
    └── package.json
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/employee-management-system.git

cd employee-management-system
```

---

## Install Backend

```bash
cd server

npm install
```

---

## Install Frontend

```bash
cd ../client

npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key

JWT_EXPIRES_IN=7d

JWT_COOKIE_EXPIRES_IN=7
```

---

# ▶️ Running the Application

### Backend

```bash
cd server

npm run dev
```

---

### Frontend

```bash
cd client

npm run dev
```

---

Open your browser:

```
http://localhost:5173
```

---

# 🌐 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/profile` |
| GET | `/api/auth/logout` |
| PUT | `/api/auth/change-password` |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/api/dashboard/summary` |

---

## Departments

| Method | Endpoint |
|---------|----------|
| GET | `/api/departments` |
| POST | `/api/departments` |
| PUT | `/api/departments/:id` |
| DELETE | `/api/departments/:id` |

---

## Employees

| Method | Endpoint |
|---------|----------|
| GET | `/api/employees` |
| GET | `/api/employees/:id` |
| POST | `/api/employees` |
| PUT | `/api/employees/:id` |
| DELETE | `/api/employees/:id` |

---

# 📸 Screenshots

### 🔑 Login

![Login](./Screenshot/login.png)

---

### 📊 Dashboard

![Dashboard](./Screenshot/dashboard.png)

---

### 👨‍💼 Employees

![Employees](./Screenshot/employee.png)

---

### ➕ Add Employee

![Add Employee](./Screenshot/addemployee.png)

---

# 🚀 Future Improvements

- [ ] CSV Import & Export
- [ ] Role-Based Access Control (RBAC)
- [ ] Email Notifications
- [ ] Audit Logs
- [ ] Cloud Deployment
- [ ] Docker Support
- [ ] Dark Mode
- [ ] Employee Attendance Module

---

# 👨‍💻 Author

**Aditya Pratap Pandey**

GitHub: https://github.com/AdityaPPandey27

LinkedIn: https://www.linkedin.com/in/aditya-pratap-pandey-875b36273/

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

## ⭐ If you found this project helpful, don't forget to give it a Star!

Made with ❤️ using the MERN Stack.

</div>