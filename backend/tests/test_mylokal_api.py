"""
Backend API Tests for MYLokal App
Tests all endpoints: categories, banners, listings, news, notifications, search, cart
"""
import pytest
import requests
import os

# Get BASE_URL from environment
BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL')
if not BASE_URL:
    pytest.skip("EXPO_PUBLIC_BACKEND_URL not set", allow_module_level=True)

BASE_URL = BASE_URL.rstrip('/')


class TestHealthAndRoot:
    """Test basic API health"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "MYLokal" in data["message"]


class TestCategories:
    """Test category endpoints - should return 6 categories"""
    
    def test_get_all_categories(self):
        """Test GET /api/categories returns all 6 categories"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 categories, got {len(data)}"
        
        # Verify category structure
        for cat in data:
            assert "id" in cat
            assert "name" in cat
            assert "image_url" in cat
            assert "order" in cat
    
    def test_categories_correct_names(self):
        """Verify all 6 expected categories exist"""
        response = requests.get(f"{BASE_URL}/api/categories")
        data = response.json()
        
        category_names = [cat["name"] for cat in data]
        expected = ["FOOD&BEVERAGE", "HALAL", "OUTDOOR ACTIVITY", "SHOPPING MALL", "TRAVEL", "ALL SERVICE"]
        
        for expected_name in expected:
            assert expected_name in category_names, f"Category '{expected_name}' not found"
    
    def test_get_single_category(self):
        """Test GET /api/categories/{id}"""
        response = requests.get(f"{BASE_URL}/api/categories/cat-food")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == "cat-food"
        assert data["name"] == "FOOD&BEVERAGE"
    
    def test_get_invalid_category(self):
        """Test GET /api/categories/{invalid_id}"""
        response = requests.get(f"{BASE_URL}/api/categories/invalid-id")
        data = response.json()
        assert "error" in data


class TestBanners:
    """Test banner endpoints"""
    
    def test_get_all_banners(self):
        """Test GET /api/banners returns banners"""
        response = requests.get(f"{BASE_URL}/api/banners")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3, "Should have at least 3 banners"
        
        # Verify banner structure
        for banner in data:
            assert "id" in banner
            assert "title" in banner
            assert "image_url" in banner
            assert "banner_type" in banner
    
    def test_banners_contain_required_types(self):
        """Verify required banners exist: welcome, slide, featured"""
        response = requests.get(f"{BASE_URL}/api/banners")
        data = response.json()
        
        banner_types = [b["banner_type"] for b in data]
        assert "welcome" in banner_types, "Missing welcome banner"
        assert "featured" in banner_types, "Missing featured banner"


class TestListings:
    """Test listing endpoints"""
    
    def test_get_all_listings(self):
        """Test GET /api/listings returns all listings"""
        response = requests.get(f"{BASE_URL}/api/listings")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5, "Should have at least 5 listings"
        
        # Verify listing structure
        for listing in data:
            assert "id" in listing
            assert "name" in listing
            assert "image_url" in listing
            assert "category_id" in listing
            assert "is_featured" in listing
    
    def test_get_featured_listings(self):
        """Test GET /api/listings?featured=true"""
        response = requests.get(f"{BASE_URL}/api/listings?featured=true")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should have featured listings"
        
        # All should be featured
        for listing in data:
            assert listing["is_featured"] == True
    
    def test_get_listings_by_category(self):
        """Test GET /api/listings?category_id=cat-food"""
        response = requests.get(f"{BASE_URL}/api/listings?category_id=cat-food")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # All should be in food category
        for listing in data:
            assert listing["category_id"] == "cat-food"
    
    def test_get_single_listing(self):
        """Test GET /api/listings/{id}"""
        response = requests.get(f"{BASE_URL}/api/listings/list-1")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == "list-1"
        assert data["name"] == "Alila Bangsar Hotel"
    
    def test_listing_has_hotel(self):
        """Verify Alila Bangsar Hotel exists in listings"""
        response = requests.get(f"{BASE_URL}/api/listings")
        data = response.json()
        
        hotel_names = [l["name"] for l in data]
        assert "Alila Bangsar Hotel" in hotel_names


class TestNews:
    """Test news endpoints"""
    
    def test_get_all_news(self):
        """Test GET /api/news returns news articles"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3, "Should have at least 3 news articles"
        
        # Verify news structure
        for article in data:
            assert "id" in article
            assert "title" in article
            assert "created_at" in article


class TestNotifications:
    """Test notification endpoints"""
    
    def test_get_all_notifications(self):
        """Test GET /api/notifications returns notifications"""
        response = requests.get(f"{BASE_URL}/api/notifications")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2, "Should have at least 2 notifications"
        
        # Verify notification structure
        for notif in data:
            assert "id" in notif
            assert "title" in notif
            assert "message" in notif
            assert "is_read" in notif
    
    def test_mark_notification_read(self):
        """Test PUT /api/notifications/{id}/read"""
        # First get a notification
        response = requests.get(f"{BASE_URL}/api/notifications")
        data = response.json()
        
        if len(data) > 0:
            notif_id = data[0]["id"]
            
            # Mark as read
            response = requests.put(f"{BASE_URL}/api/notifications/{notif_id}/read")
            assert response.status_code == 200
            
            result = response.json()
            assert result.get("success") == True


class TestSearch:
    """Test search endpoint"""
    
    def test_search_hotel(self):
        """Test GET /api/search?q=hotel returns hotel results"""
        response = requests.get(f"{BASE_URL}/api/search?q=hotel")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should return hotel search results"
        
        # Verify 'hotel' appears in results
        found_hotel = any("hotel" in item["name"].lower() or "hotel" in item.get("description", "").lower() for item in data)
        assert found_hotel, "Search results should contain 'hotel'"
    
    def test_search_empty_query(self):
        """Test GET /api/search with empty query"""
        response = requests.get(f"{BASE_URL}/api/search?q=")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0, "Empty query should return empty list"
    
    def test_search_case_insensitive(self):
        """Test search is case insensitive"""
        response = requests.get(f"{BASE_URL}/api/search?q=HOTEL")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) > 0, "Case insensitive search should return results"


class TestCart:
    """Test cart endpoints"""
    
    def test_get_cart_count(self):
        """Test GET /api/cart/count"""
        response = requests.get(f"{BASE_URL}/api/cart/count")
        assert response.status_code == 200
        
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
    
    def test_get_cart(self):
        """Test GET /api/cart"""
        response = requests.get(f"{BASE_URL}/api/cart")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)


# Run with: pytest /app/backend/tests/test_mylokal_api.py -v --tb=short --junitxml=/app/test_reports/pytest/pytest_results.xml
