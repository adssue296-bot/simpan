# MYLokal - Malaysian Local Services Marketplace App

## Overview
MYLokal adalah aplikasi marketplace perkhidmatan tempatan Malaysia yang membolehkan pengguna mencari restoran, hotel, pusat beli-belah, aktiviti luar, dan pelbagai perkhidmatan lain di Malaysia.

## Features
- **Home Page**: Banner selamat datang, banner "Jalan Jalan Cari Makan", listing hotel dan perkhidmatan yang ditampilkan
- **Category Page (Looking For)**: 6 kategori - FOOD&BEVERAGE, HALAL, OUTDOOR ACTIVITY, SHOPPING MALL, TRAVEL, ALL SERVICE
- **News Feed**: Berita terkini dan artikel tentang acara tempatan
- **Notifications**: Pemberitahuan tentang promosi, tempahan, dan kemas kini
- **MYProfile**: Profil pengguna dengan pilihan log masuk/daftar
- **Search**: Carian perkhidmatan merentas semua kategori
- **Cart**: Fungsi troli belanja

## Tech Stack
- **Frontend**: React Native (Expo Router) with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **UI**: Custom components with magenta (#FF00FF) theme

## MongoDB Collections
- `categories` - 6 kategori perkhidmatan
- `banners` - Banner halaman utama
- `listings` - 10 perkhidmatan/peniaga
- `news` - 5 artikel berita
- `notifications` - 4 pemberitahuan
- `cart` - Item troli pengguna

## API Endpoints
- `GET /api/categories` - Senarai semua kategori
- `GET /api/categories/:id` - Butiran kategori
- `GET /api/banners` - Senarai banner
- `GET /api/listings` - Senarai perkhidmatan (filter: category_id, featured)
- `GET /api/listings/:id` - Butiran perkhidmatan
- `GET /api/news` - Senarai berita
- `GET /api/notifications` - Senarai pemberitahuan
- `PUT /api/notifications/:id/read` - Tandakan pemberitahuan sebagai dibaca
- `GET /api/search?q=` - Carian perkhidmatan
- `GET /api/cart` - Senarai troli
- `POST /api/cart` - Tambah ke troli
- `DELETE /api/cart/:id` - Buang dari troli
