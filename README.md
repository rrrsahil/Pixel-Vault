# PixelVault – Image Hosting & Media API

PixelVault is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) application designed to serve as a lightweight Image CDN. It allows multiple users to register, securely authenticate, and upload images to their own private galleries. Each image generates a permanent public URL that can be embedded across applications.

## 🚀 Features
- **Multi-Tenant Architecture**: Complete user isolation. Users only see and manage their own uploaded images.
- **JWT Authentication**: Secure login and registration flows protected by JSON Web Tokens and HttpOnly cookies.
- **Password Recovery**: Integrated SMTP email flow via Nodemailer for secure password resets natively hashing with `bcryptjs`.
- **Advanced Gallery**:
  - Native **Infinite Scrolling** using `IntersectionObserver`.
  - Advanced filtering: **Search** by filename, and dynamically **Sort** by Date or Size (Ascending/Descending).
  - Smooth **Skeleton Loaders** mapping native `onLoad` DOM events for premium UX.
- **Glassmorphism UI**: High-end SaaS aesthetics utilizing CSS `backdrop-filter`, floating geometric animations, and strict CSS Grids for uniform mobile-responsive layouts.
- **Image Optimization**: Integrated `browser-image-compression` on the client and `sharp` on the backend to enforce strict format standardization (WebP/JPEG) and duplicate hash checking.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Axios, React-Router, React-Dropzone, Date-Fns.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSONWebToken, Multer (File Handling), Nodemailer.
- **Styling**: Pure Native CSS (No Tailwind/Bootstrap) following strict modern SaaS BEM principles.

## ⚙️ Installation & Setup

1. **Clone the repository** (or download the source code).
2. **Install Dependencies**:
   Open a terminal and install root dependencies (if configured) or install individually:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. **Configure Environment Variables**:
   In the `/server` directory, create a `.env` file based on your environment:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pixelvault
   JWT_SECRET=your_super_secret_jwt_key

   # SMTP Credentials for Password Resets
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   ```
4. **Run the Application**:
   Start both the backend and frontend development servers.
   ```bash
   # Terminal 1 (Backend)
   cd server
   npm run dev

   # Terminal 2 (Frontend)
   cd client
   npm run dev
   ```
5. **Access the App**:
   Navigate to `http://localhost:5173` in your browser.

## 📂 Project Structure
- **/client**: Contains the Vite React frontend.
  - `/src/components`: Reusable UI elements (`Navbar`, `Footer`, `PrivateRoute`).
  - `/src/pages`: Core views (`Auth`, `Gallery`, `Upload`, `Home`).
  - `/src/context`: Global React Context (`AuthContext`).
  - `/src/styles`: Modular pure CSS files (`Auth.css`, `Gallery.css`).
- **/server**: Contains the Express backend API.
  - `/controllers`: Business logic (`authController`, `imageController`).
  - `/models`: Mongoose Schemas (`User`, `Image`).
  - `/routes`: API endpoints (`/api/auth`, `/api/images`).
  - `/middleware`: JWT protection & rate-limiting logic.
  - `/uploads`: Local static directory for hosted images.

## 🛡️ Security
- API endpoints are protected via `requireAuth` middleware.
- Client routes are shielded by a `<PrivateRoute>` higher-order component.
- Passwords are never stored in plaintext (`bcryptjs`).
- Uploads are sanitized, strictly formatted, and rate-limited to avoid abuse.
