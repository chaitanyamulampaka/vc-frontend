# 🛍️ Varaha Crafts – Full Stack E-commerce Platform

A full-stack e-commerce platform built to empower rural artisans by enabling them to sell **Etikoppaka handicrafts** directly to customers.

---

## 🌐 Live Demo

🔗 https://vc-frontend-ggvpqpip7-chaitanyamulampaka-gmailcoms-projects.vercel.app/

---

## 📌 Overview

Varaha Crafts connects rural artisans with customers through a modern digital platform.
It implements a scalable architecture with **JWT authentication and Role-Based Access Control (RBAC)**.

---

## 🚀 Tech Stack

### 🎨 Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router
* JWT Authentication

### ⚙️ Backend

* Django
* Django REST Framework (DRF)
* PostgreSQL
* JWT (SimpleJWT)
* RBAC (Role-Based Access Control)

### 🔗 Integrations

* Razorpay (Payments)
* Cloudinary (Image Storage)
* Shiprocket API (Shipping)

---

## 🔐 User Roles (RBAC)

* **👤 Consumer**

  * Browse products
  * Add to cart / wishlist
  * Place orders & make payments
  * View order history

* **🎨 Artist (Seller)**

  * Add / update / delete products
  * Upload images
  * Manage inventory
  * View orders of their products

* **🛠️ Admin**

  * Manage users (Consumers & Artists)
  * Monitor products
  * View all orders
  * Full system control

---

## ✨ Features

* 🛒 Cart & Wishlist system
* 🔐 Secure JWT Authentication
* 🔑 Role-Based Access Control (RBAC)
* 💳 Razorpay Payment Integration
* 🚚 Shiprocket Shipping Integration
* 🖼️ Cloudinary Image Upload
* 📦 Order Management System
* 📊 Admin Dashboard

---

## 🧠 Problem Statement

Rural artisans lack direct access to digital marketplaces.
This platform enables **direct-to-customer selling**, reducing intermediaries and improving artisan income.

---

## 🏗️ Architecture

```
Frontend (React)
      ↓
REST API (Axios)
      ↓
Backend (Django + DRF)
      ↓
PostgreSQL Database
      ↓
Cloudinary | Razorpay | Shiprocket
```

---

## 🔑 Authentication Flow

* JWT-based authentication
* Access + Refresh tokens
* Protected routes
* Role-based authorization

---

## 📁 Project Structure

### Frontend (vc-frontend)

```
src/
 ├── components/
 ├── pages/
 ├── context/
 ├── services/
 └── App.jsx
```

### Backend (vc-backend)

```
apps/
 ├── users/
 ├── products/
 ├── orders/
 ├── cart/
 └── payments/
```

---

## 🔗 Repositories

* Frontend: https://github.com/chaitanyamulampaka/vc-frontend
* Backend: https://github.com/chaitanyamulampaka/vc-backend

---

## ⚙️ Installation

### Backend

```
git clone https://github.com/chaitanyamulampaka/vc-backend.git
cd vc-backend

python -m venv env
env\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```
git clone https://github.com/chaitanyamulampaka/vc-frontend.git
cd vc-frontend

npm install
npm run dev
```

---

## 🔑 Environment Variables

```
SECRET_KEY=your_secret_key

DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 📸 Screenshots

(Add screenshots of Home, Product, Cart, Checkout, Admin Panel)

---

## 📈 Future Improvements

* AI-based recommendations
* Real-time order tracking
* Mobile app version
* Multi-language support

---

## 🧪 Testing

* Tested APIs using Postman
* Verified end-to-end user flow

---

## 💼 Resume Description

**Varaha Crafts – Full Stack E-commerce Platform**

* Built using React, Django REST Framework, and PostgreSQL
* Implemented JWT authentication and Role-Based Access Control (RBAC)
* Integrated Razorpay for payments and Shiprocket for logistics
* Developed scalable REST APIs and responsive UI

---

## 👨‍💻 Author

**Chaitanya**
Computer Science Engineering Student

---

⭐ If you like this project, give it a star!
