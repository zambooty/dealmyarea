from fastapi import APIRouter, HTTPException, Query # type: ignore
from typing import List, Optional
from ..models.deal import Deal
from datetime import datetime
import math

router = APIRouter(prefix="/deals", tags=["deals"])

# Sample deals for testing
deals_db = [
    Deal(
        id="1",
        title="50% off Groceries",
        description="Get 50% off on all groceries at SuperMart",
        price=99.99,
        store_name="SuperMart",
        category="Groceries",
        location={"lat": 37.7749, "lng": -122.4194},
        created_at=datetime.now(),
    ),
    Deal(
        id="2",
        title="Electronics Sale",
        description="Big discounts on electronics",
        price=499.99,
        store_name="TechZone",
        category="Electronics",
        location={"lat": 37.7749, "lng": -122.4194},
        created_at=datetime.now(),
    ),
    Deal(
        id="3",
        title="Fashion Week Sale",
        description="Up to 70% off on all clothing",
        price=79.99,
        store_name="Fashion Hub",
        category="Clothing",
        location={"lat": 37.7749, "lng": -122.4194},
        created_at=datetime.now(),
    ),
]

@router.post("/", response_model=Deal)
async def create_deal(deal: Deal):
    # Generate a simple ID for the deal
    deal.id = str(len(deals_db) + 1)
    deal.created_at = datetime.now()
    deals_db.append(deal)
    return deal

@router.get("/", response_model=List[Deal])
async def get_deals(
    category: Optional[str] = None,
    store: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    lat: Optional[float] = Query(None, description="Latitude for location-based search"),
    lng: Optional[float] = Query(None, description="Longitude for location-based search"),
    radius: Optional[float] = Query(5.0, description="Search radius in kilometers"),
    sort_by: Optional[str] = Query("created_at", description="Sort by field (created_at, price)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)")
):
    filtered_deals = deals_db.copy()

    # Apply filters
    if category:
        filtered_deals = [d for d in filtered_deals if d.category.lower() == category.lower()]
    if store:
        filtered_deals = [d for d in filtered_deals if d.store_name.lower() == store.lower()]
    if min_price is not None:
        filtered_deals = [d for d in filtered_deals if d.price >= min_price]
    if max_price is not None:
        filtered_deals = [d for d in filtered_deals if d.price <= max_price]
    
    # Location-based filtering
    if lat is not None and lng is not None:
        filtered_deals = [
            d for d in filtered_deals 
            if calculate_distance(lat, lng, d.location["lat"], d.location["lng"]) <= radius
        ]

    # Sorting
    reverse = sort_order.lower() == "desc"
    filtered_deals.sort(
        key=lambda x: getattr(x, sort_by),
        reverse=reverse
    )

    return filtered_deals

@router.get("/{deal_id}", response_model=Deal)
async def get_deal(deal_id: str):
    for deal in deals_db:
        if deal.id == deal_id:
            return deal
    raise HTTPException(status_code=404, detail="Deal not found")

@router.delete("/{deal_id}")
async def delete_deal(deal_id: str):
    for i, deal in enumerate(deals_db):
        if deal.id == deal_id:
            deals_db.pop(i)
            return {"message": "Deal deleted successfully"}
    raise HTTPException(status_code=404, detail="Deal not found")

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c

    return distance
 