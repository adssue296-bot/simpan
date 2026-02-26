from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image_url: str
    description: str = ""
    order: int = 0

class Banner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str = ""
    image_url: str
    link: str = ""
    order: int = 0
    banner_type: str = "slide"

class Listing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    image_url: str
    category_id: str
    address: str = ""
    phone: str = ""
    rating: float = 0.0
    price_range: str = ""
    is_featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    image_url: str = ""
    link_url: str = ""
    youtube_id: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    message: str
    notification_type: str = "general"
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "Guest User"
    email: str = ""
    phone: str = ""
    avatar_url: str = ""
    member_id: str = ""
    is_logged_in: bool = False

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    listing_name: str
    quantity: int = 1
    price: float = 0.0

# Seed Data
async def seed_data():
    # Seed Categories
    cat_count = await db.categories.count_documents({})
    if cat_count == 0:
        categories = [
            {
                "id": "cat-food",
                "name": "FOOD&BEVERAGE",
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "description": "Restaurants, cafes, food stalls and more",
                "order": 1
            },
            {
                "id": "cat-halal",
                "name": "HALAL",
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                "description": "Halal certified restaurants and food",
                "order": 2
            },
            {
                "id": "cat-outdoor",
                "name": "OUTDOOR ACTIVITY",
                "image_url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80",
                "description": "Outdoor adventures and activities",
                "order": 3
            },
            {
                "id": "cat-shopping",
                "name": "SHOPPING MALL",
                "image_url": "https://images.unsplash.com/photo-1567449303078-57ad995bd329?auto=format&fit=crop&w=400&q=80",
                "description": "Shopping malls and retail stores",
                "order": 4
            },
            {
                "id": "cat-travel",
                "name": "TRAVEL",
                "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
                "description": "Travel services and destinations",
                "order": 5
            },
            {
                "id": "cat-all",
                "name": "ALL SERVICE",
                "image_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80",
                "description": "All available services",
                "order": 6
            }
        ]
        await db.categories.insert_many(categories)
        logging.info("Seeded categories")

    # Seed Banners
    banner_count = await db.banners.count_documents({})
    if banner_count == 0:
        banners = [
            {
                "id": "banner-welcome",
                "title": "WELCOME TO",
                "subtitle": "MYLokal",
                "image_url": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
                "banner_type": "welcome",
                "order": 1
            },
            {
                "id": "banner-jalan",
                "title": "Jalan jalan",
                "subtitle": "Cari Makan",
                "image_url": "https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=800&q=80",
                "banner_type": "slide",
                "order": 2
            },
            {
                "id": "banner-hotel",
                "title": "Alila Bangsar",
                "subtitle": "Hotel",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                "banner_type": "featured",
                "order": 3
            },
            {
                "id": "banner-promo",
                "title": "Best Deals",
                "subtitle": "Special Promotions",
                "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
                "banner_type": "slide",
                "order": 4
            }
        ]
        await db.banners.insert_many(banners)
        logging.info("Seeded banners")

    # Seed Listings
    listing_count = await db.listings.count_documents({})
    if listing_count == 0:
        listings = [
            {
                "id": "list-1",
                "name": "Alila Bangsar Hotel",
                "description": "A boutique luxury hotel located in the heart of Bangsar, KL. Experience modern comfort with a local touch.",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-travel",
                "address": "58, Jalan Ang Seng, Bangsar, 50150 KL",
                "phone": "+603-2268 3888",
                "rating": 4.5,
                "price_range": "RM350-RM800",
                "is_featured": True
            },
            {
                "id": "list-2",
                "name": "Nasi Kandar Pelita",
                "description": "Famous Nasi Kandar restaurant serving authentic Malaysian food 24 hours.",
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-food",
                "address": "149, Jalan Ampang, 50450 KL",
                "phone": "+603-2163 5751",
                "rating": 4.2,
                "price_range": "RM8-RM25",
                "is_featured": True
            },
            {
                "id": "list-3",
                "name": "Pavilion Kuala Lumpur",
                "description": "Premier shopping mall in Bukit Bintang with luxury brands and dining.",
                "image_url": "https://images.unsplash.com/photo-1567449303078-57ad995bd329?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-shopping",
                "address": "168, Jalan Bukit Bintang, 55100 KL",
                "phone": "+603-2118 8833",
                "rating": 4.7,
                "price_range": "Various",
                "is_featured": True
            },
            {
                "id": "list-4",
                "name": "KLCC Park Jogging Track",
                "description": "Scenic jogging track around the iconic KLCC park with Petronas Towers view.",
                "image_url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-outdoor",
                "address": "KLCC, Jalan Ampang, 50088 KL",
                "phone": "",
                "rating": 4.6,
                "price_range": "Free",
                "is_featured": False
            },
            {
                "id": "list-5",
                "name": "Madam Kwan's",
                "description": "Award-winning Malaysian cuisine restaurant. Famous for Nasi Bojari and Satay.",
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-halal",
                "address": "Suria KLCC, Jalan Ampang, 50088 KL",
                "phone": "+603-2026 2297",
                "rating": 4.4,
                "price_range": "RM20-RM50",
                "is_featured": True
            },
            {
                "id": "list-6",
                "name": "Malaysia Travel Agency",
                "description": "Full service travel agency offering domestic and international tour packages.",
                "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-travel",
                "address": "Lot 3.12, Suria KLCC, 50088 KL",
                "phone": "+603-2382 9988",
                "rating": 4.0,
                "price_range": "RM500+",
                "is_featured": False
            },
            {
                "id": "list-7",
                "name": "Village Park Restaurant",
                "description": "Famous for Nasi Lemak Ayam Goreng. A must-visit in Damansara.",
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-food",
                "address": "5, Jalan SS21/37, Damansara Utama",
                "phone": "+603-7710 7860",
                "rating": 4.3,
                "price_range": "RM8-RM20",
                "is_featured": True
            },
            {
                "id": "list-8",
                "name": "Mid Valley Megamall",
                "description": "One of the largest malls in Southeast Asia with endless shopping options.",
                "image_url": "https://images.unsplash.com/photo-1519567241046-7f570f9e0b5a?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-shopping",
                "address": "Mid Valley City, Lingkaran Syed Putra, 59200 KL",
                "phone": "+603-2938 3333",
                "rating": 4.5,
                "price_range": "Various",
                "is_featured": False
            },
            {
                "id": "list-9",
                "name": "Batu Caves Adventure",
                "description": "Explore the iconic limestone caves and Hindu temples. Great for hiking.",
                "image_url": "https://images.unsplash.com/photo-1582810953440-7a54d15a59f0?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-outdoor",
                "address": "Batu Caves, 68100 Selangor",
                "phone": "",
                "rating": 4.8,
                "price_range": "Free",
                "is_featured": True
            },
            {
                "id": "list-10",
                "name": "LC Cleaning Services",
                "description": "Professional cleaning services for homes and offices. Quality guaranteed.",
                "image_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80",
                "category_id": "cat-all",
                "address": "Petaling Jaya, Selangor",
                "phone": "+6012-345 6789",
                "rating": 4.1,
                "price_range": "RM150+",
                "is_featured": False
            }
        ]
        await db.listings.insert_many(listings)
        logging.info("Seeded listings")

    # Seed News
    news_count = await db.news.count_documents({})
    if news_count == 0:
        news = [
            {
                "id": "news-1",
                "title": "MYLokal Melancarkan Perkhidmatan Baru",
                "description": "MYLokal kini menawarkan perkhidmatan tempahan hotel secara langsung melalui aplikasi. Nikmati diskaun eksklusif untuk pengguna baru!",
                "image_url": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80",
                "created_at": "2026-02-25T10:00:00Z"
            },
            {
                "id": "news-2",
                "title": "Festival Makanan Kuala Lumpur 2026",
                "description": "Pesta makanan terbesar di KL akan berlangsung pada bulan Mac. Lebih 200 gerai makanan dari seluruh Malaysia!",
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                "created_at": "2026-02-24T08:30:00Z"
            },
            {
                "id": "news-3",
                "title": "Promosi Raya Aidilfitri",
                "description": "Dapatkan diskaun sehingga 50% untuk perkhidmatan terpilih sempena Hari Raya Aidilfitri. Jangan lepaskan peluang ini!",
                "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
                "created_at": "2026-02-23T14:00:00Z"
            },
            {
                "id": "news-4",
                "title": "Tempat Menarik Di Selangor",
                "description": "Jelajahi 10 tempat menarik yang wajib dikunjungi di Selangor. Dari air terjun hingga taman tema, semuanya ada!",
                "image_url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80",
                "created_at": "2026-02-22T09:15:00Z"
            },
            {
                "id": "news-5",
                "title": "Hotel Baharu Di Bangsar",
                "description": "Hotel boutique terbaru telah dibuka di kawasan Bangsar dengan kemudahan moden dan harga berpatutan.",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
                "created_at": "2026-02-21T16:45:00Z"
            }
        ]
        await db.news.insert_many(news)
        logging.info("Seeded news")

    # Seed Notifications
    notif_count = await db.notifications.count_documents({})
    if notif_count == 0:
        notifications = [
            {
                "id": "notif-1",
                "title": "Selamat Datang!",
                "message": "Terima kasih kerana menggunakan MYLokal. Jelajahi perkhidmatan lokal terbaik di sekitar anda!",
                "notification_type": "welcome",
                "is_read": False,
                "created_at": "2026-02-26T10:00:00Z"
            },
            {
                "id": "notif-2",
                "title": "Promosi Istimewa",
                "message": "Diskaun 30% untuk semua restoran terpilih minggu ini. Jangan lepaskan!",
                "notification_type": "promo",
                "is_read": False,
                "created_at": "2026-02-25T14:30:00Z"
            },
            {
                "id": "notif-3",
                "title": "Kemas Kini Aplikasi",
                "message": "Versi terbaru MYLokal kini tersedia dengan ciri-ciri baharu yang menarik!",
                "notification_type": "update",
                "is_read": True,
                "created_at": "2026-02-24T09:00:00Z"
            },
            {
                "id": "notif-4",
                "title": "Tempahan Berjaya",
                "message": "Tempahan anda di Alila Bangsar Hotel telah disahkan. Sila semak butiran.",
                "notification_type": "booking",
                "is_read": True,
                "created_at": "2026-02-23T11:20:00Z"
            }
        ]
        await db.notifications.insert_many(notifications)
        logging.info("Seeded notifications")

    logging.info("Seed data check complete")


# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "MYLokal API"}

@api_router.get("/categories")
async def get_categories():
    cats = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return cats

@api_router.get("/categories/{category_id}")
async def get_category(category_id: str):
    cat = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not cat:
        return {"error": "Category not found"}
    return cat

@api_router.get("/banners")
async def get_banners():
    banners = await db.banners.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return banners

@api_router.get("/listings")
async def get_listings(category_id: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if featured is not None:
        query["is_featured"] = featured
    listings = await db.listings.find(query, {"_id": 0}).to_list(100)
    return listings

@api_router.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        return {"error": "Listing not found"}
    return listing

@api_router.get("/news")
async def get_news():
    news = await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return news

@api_router.get("/notifications")
async def get_notifications():
    notifs = await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return notifs

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True}}
    )
    return {"success": True}

@api_router.get("/search")
async def search(q: str = ""):
    if not q:
        return []
    results = await db.listings.find(
        {"$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]},
        {"_id": 0}
    ).to_list(50)
    return results

@api_router.get("/cart")
async def get_cart():
    items = await db.cart.find({}, {"_id": 0}).to_list(100)
    return items

@api_router.post("/cart")
async def add_to_cart(item: CartItem):
    item_dict = item.dict()
    await db.cart.insert_one(item_dict)
    return {"success": True, "item": item_dict}

@api_router.delete("/cart/{item_id}")
async def remove_from_cart(item_id: str):
    await db.cart.delete_one({"id": item_id})
    return {"success": True}

@api_router.get("/cart/count")
async def get_cart_count():
    count = await db.cart.count_documents({})
    return {"count": count}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await seed_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
