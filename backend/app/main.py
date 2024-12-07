from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .api import deals
import os

load_dotenv()

app = FastAPI(
    title="DealmyArea API",
    description="API for DealmyArea - Your Ultimate Local Shopping Companion",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(deals.router)

@app.get("/")
async def root():
    return {"message": "Welcome to DealmyArea API"} 