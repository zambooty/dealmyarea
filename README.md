# DealmyArea

Your Ultimate Local Shopping Companion - Find the best deals in your area!

## Project Structure

```
dealmyarea/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app router
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
└── backend/          # FastAPI backend application
    └── app/
        ├── api/      # API routes
        ├── models/   # Pydantic models
        └── services/ # Business logic
```

## Getting Started

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will be available at `http://localhost:8000`

## Features

- 🗺️ Interactive Local Maps
- 💰 Price Comparison
- 🎯 Personalized Experience
- 👥 Community Features
- 🌐 Online Integration
- 📊 Smart Analytics
- 💳 Secure Payments
- 🌱 Eco-Friendly Shopping

## Technologies Used

- Frontend:
  - Next.js 14
  - TypeScript
  - NextUI
  - Tailwind CSS
  - Firebase

- Backend:
  - FastAPI
  - Python
  - SQLAlchemy
  - Firebase Admin SDK 