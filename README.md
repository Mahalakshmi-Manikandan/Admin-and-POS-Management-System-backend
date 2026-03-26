# Admin & POS Management System – Backend

A robust **Backend API for Admin & POS (Point of Sale) Management System** developed to handle authentication, user management, billing, inventory, and business operations.

This project was built as part of a **company task**, focusing on real-world backend development and API integration.

---

##  Project Overview

The backend provides secure and scalable APIs for managing system data, handling business logic, and connecting with the frontend application.

It ensures smooth communication between the database and frontend using RESTful services.

---



###  Authentication & Authorization
- Secure login system
- Password encryption (bcrypt)
- Role-based access (Admin / Staff )

### User Management
- Create, update, delete users
- Manage roles and permissions
- Store user details securely

###  POS & Billing
- Create and manage orders
- Apply discounts and promotions
- Generate bill data for printing

###  Inventory Management
- Add / update / delete products
- Manage stock levels
- Category and pricing control

### Data Handling
- Efficient database operations
- CRUD APIs for all modules
- Error handling and validation

---

## Tech Stack

- Node.js
-  Express.js
- MySQL
- bcrypt (password hashing)
- JWT (authentication)
- REST API

---

##  Project Structure


backend/
│── controllers/ # Business logic

│── routes/ # API routes

│── models/ # Database queries

│── config/ # Database configuration

│── middleware/ # Auth & validation

│── server.js # Entry point



## Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/Mahalakshmi-Manikandan/Admin-and-POS-Management-System-backend.git

2️⃣ Navigate to project


cd Admin-and-POS-Management-System-backend

3️⃣ Install dependencies

npm install

4️⃣ Configure environment variables


Create a .env file and add:

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=yourpassword

DB_NAME=yourdatabase

JWT_SECRET=yoursecretkey

5️⃣ Run the server

npm start
