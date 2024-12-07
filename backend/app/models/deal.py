from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Deal(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=500)
    price: float = Field(..., gt=0)
    store_name: str = Field(..., min_length=2, max_length=100)
    location: dict = Field(..., example={"lat": 37.7749, "lng": -122.4194})
    created_at: datetime = Field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None
    category: str = Field(..., min_length=2, max_length=50)
    image_url: Optional[str] = None 