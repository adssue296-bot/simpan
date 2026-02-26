const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

export async function fetchCategory(id: string) {
  const res = await fetch(`${API_BASE}/categories/${id}`);
  return res.json();
}

export async function fetchBanners() {
  const res = await fetch(`${API_BASE}/banners`);
  return res.json();
}

export async function fetchListings(categoryId?: string, featured?: boolean) {
  let url = `${API_BASE}/listings`;
  const params: string[] = [];
  if (categoryId) params.push(`category_id=${categoryId}`);
  if (featured !== undefined) params.push(`featured=${featured}`);
  if (params.length) url += `?${params.join('&')}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchListing(id: string) {
  const res = await fetch(`${API_BASE}/listings/${id}`);
  return res.json();
}

export async function fetchNews() {
  const res = await fetch(`${API_BASE}/news`);
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  return res.json();
}

export async function markNotificationRead(id: string) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
  return res.json();
}

export async function searchListings(query: string) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function fetchCartCount() {
  const res = await fetch(`${API_BASE}/cart/count`);
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_BASE}/cart`);
  return res.json();
}

export async function addToCart(item: { listing_id: string; listing_name: string; quantity: number; price: number }) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function removeFromCart(itemId: string) {
  const res = await fetch(`${API_BASE}/cart/${itemId}`, { method: 'DELETE' });
  return res.json();
}
