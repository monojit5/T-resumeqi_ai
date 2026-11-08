# AI Resume Builder 🚀

An AI-powered Resume Builder application built using the MERN Stack. This application helps users create professional resumes with the assistance of Artificial Intelligence.

## 🚀 Features

- User Registration and Login
- JWT Authentication
- AI-Powered Resume Generation
- Create and Edit Resumes
- Professional Resume Templates
- Personal Details Management
- Education and Experience Sections
- Skills and Projects Management
- Download Resume as PDF
- Responsive User Interface

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js

### AI Integration
- Google Gemini API

### Additional Tools
- Redis
- Git & GitHub

## 📁 Project Structure

```text
AI-Resume-Builder/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── assets/
│
└── README.md
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Resume-Builder
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=your_redis_url
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

## 🔐 Environment Variables

Never upload your `.env` file or API secrets to GitHub.

## 👨‍💻 Developer

Developed as a full-stack web development project using the MERN Stack and Generative AI.

## 📄 License

This project is created for educational and development purposes.
