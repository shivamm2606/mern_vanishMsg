# ZeroTrace

> **Share sensitive information securely that vanishes after being read.**

ZeroTrace is a MERN stack application designed to share one-time viewable secrets. Once a secret is viewed, it is permanently deleted from the database.

## Features

- **Create a Secret:** Generate a secure link for your sensitive text.
- **One-Time View:** The secret is deleted immediately after it is accessed.
- **Secure:** secrets are stored encrypted (AES) in the database.
- **Mobile Friendly:** Responsive design for all devices.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Crypto (Native Node module).
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Security**: Helmet, CORS, Rate Limiting, Joi Validation, HttpOnly Cookies.

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd ZeroTrace
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in `backend/` based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/vanishpass
   JWT_SECRET=your_super_secret_jwt_key
   ENCRYPTION_KEY=12345678901234567890123456789012  # Must be 32 chars
   ADMIN_PASSWORD=admin
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Running Locally

1. **Start Backend**
   ```bash
   # In backend directory
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

2. **Start Frontend**
   ```bash
   # In frontend directory
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Deployment

### Vercel (Frontend)
1. Push code to GitHub.
2. Import `frontend` directory project in Vercel.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add configuration if needed for routing (configured in code).

### Render (Backend)
1. Create a Web Service on Render connected to the repo.
2. Root Directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `ENCRYPTION_KEY`, `ADMIN_PASSWORD`.

## API Endpoints

- `POST /api/secrets`: Create a new secret.
- `GET /api/secrets/:id`: Reveal and destroy a secret.
- `POST /api/admin/login`: Admin login.
- `GET /api/admin/stats`: Get active secret count.
