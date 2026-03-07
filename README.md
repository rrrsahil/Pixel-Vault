# PixelVault – Image Hosting & Media API

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Node](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

PixelVault is a **production-ready full-stack MERN application** that works as a lightweight **Image Hosting & Media API**.
Users can securely upload images, manage private galleries, and generate permanent public image URLs that can be embedded across applications.

The system demonstrates **modern SaaS UI design, optimized image processing, and secure authentication architecture.**

---

# 🌐 Live Demo

https://pixel-vault-frontend-mpin.onrender.com/

---

---

# 🚀 Features

### 🔐 Authentication & Security

* Secure **JWT Authentication**
* Password hashing using **bcrypt**
* Protected API routes via middleware
* Secure authentication cookies

### 🖼 Image Hosting

* Upload images with drag-and-drop
* Automatic image compression
* Image optimization using **Sharp**
* Permanent public image URLs

### 👤 Multi-User System

* Complete **user data isolation**
* Each user manages their own private gallery

### ⚡ Advanced Gallery

* Infinite scrolling with **IntersectionObserver**
* Image search by filename
* Sorting by **date / size**
* Responsive grid layout

### 🎨 Modern UI

* Glassmorphism UI design
* Smooth skeleton loaders
* Fully responsive layouts
* Clean SaaS-style interface

---

# 🛠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* React Dropzone

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (file uploads)
* Sharp (image processing)
* Nodemailer (email service)

### Styling

* Pure CSS
* Responsive Grid Layout

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rrrsahil/Pixel-Vault.git
cd Pixel-Vault
```

---

### 2️⃣ Install dependencies

Backend

```bash
cd server
npm install
```

Frontend

```bash
cd client
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file inside the **server folder**

Example configuration:

```
PORT=5000
MONGODB_URI=your_database_connection
JWT_SECRET=your_secret_key
MAIL_HOST=smtp_provider
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASS=your_password
```

⚠️ `.env` file **should never be committed to GitHub**.

---

### 4️⃣ Run Development Server

Backend

```bash
cd server
npm run dev
```

Frontend

```bash
cd client
npm run dev
```

---

### 5️⃣ Open in Browser

```
http://localhost:5173
```

---

# 📂 Project Structure

```
pixel-vault
│
├── client
│   ├── public
│   ├── src
│   ├── components
│   ├── pages
│   └── styles
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── uploads
│
└── README.md
```

---

# 🛡 Security

* Passwords stored using **bcrypt hashing**
* Protected API routes
* Authenticated image access
* File upload validation
* Rate limiting to prevent abuse

---

# 🖼 Screenshots

### Hero Banner

<img width="1000" height="600" alt="Screenshot 2026-03-07 170818" src="https://github.com/user-attachments/assets/474f41b4-24da-42f0-8389-3989cdb346d0" />


```
/screenshots/home.png
```

### Gallery

<img width="1000" height="600" alt="Screenshot 2026-03-07 171023" src="https://github.com/user-attachments/assets/1aef68ba-92d0-4b9a-83ca-2f2153dada86" />

```
/screenshots/gallery.png
```

### Upload Page

<img width="1000" height="600" alt="Screenshot 2026-03-07 170904" src="https://github.com/user-attachments/assets/cbb4140a-2095-4a0f-be5b-fb9e3fe7df88" />

```
/screenshots/upload.png
```

---

# 🧠 Architecture Diagram

```
Client (React)
      │
      │ REST API
      ▼
Server (Node + Express)
      │
      │
MongoDB Database
```

---

# 📘 API Overview

Example Endpoints

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login             |
| POST   | /api/images/upload | Upload image      |
| GET    | /api/images        | Fetch user images |
| DELETE | /api/images/:id    | Delete image      |

---

# 🚀 Deployment

### Backend

Recommended platforms

* Render
* Railway
* DigitalOcean

### Frontend

Recommended platforms

* Vercel
* Netlify

---

# 👨‍💻 Author

Alok Pandit

GitHub
https://github.com/rrrsahil

---

# 📜 License

This project is licensed under the MIT License.
