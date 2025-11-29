# Inventory Allocation System – FOOM Lab Global Test

## How to Run the Project Locally

### **1️. Clone Repository**

```bash
git clone <your-repo-url>
cd <repo-folder>
```

---

## **2️. Backend Setup**

```bash
cd backend
npm install
```

### **Environment Variables**

Copy example:

```bash
cp .env.example .env
```

### **Run PostgreSQL (Docker Based)**

```bash
docker compose up -d
```

### **Create DB, run migrations, and seeding**

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### **Start Backend**

```bash
node src/app.js
```

Backend runs at:

```
http://localhost:5000
```

### **Postman json for testing**

Bisa di download di https://drive.google.com/file/d/1IbLahS5aUXgio4oNbsB0a03tQjkm7WW8/view?usp=sharing 

---

## **3️. Frontend Setup**

```bash
cd frontend
npm install
```

### **Run Frontend**

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## **4. Ngrok setup**
Download ngrok sebagai reverse proxy to local backend https://ngrok.com/download/windows

Setup dan jalankan : 
```bash
ngrok http 5000
```
Url yang di hasilkan taruh di webhook URL https://hub.foomid.id/manager
# 🧩 Design Decisions (Core Logic)

## **1. Clean Architecture Structure**

Backend mengikuti pola:

```
routes → controllers → services → models → database
```

### **Routes**
- Definisikan endpoint.

### **Controllers**
- Validasi input.
- Build response HTTP (200, 400, 404, 500).

### **Services**
- Business logic inti.

### **Models**
- Sequelize ORM

### **Migrations**
- Jalankan migration yang sudah di create

---

## **2. Purchase Request Logic**

### **Create PR**
- Wajib memiliki warehouse
- Minimal satu item
- Item disimpan di `PurchaseRequestItems`
- Status default: `DRAFT`

### **Update PR**
- Hanya bisa dilakukan dalam status `DRAFT`

### **Delete PR**
- Hanya boleh di `DRAFT`

---

## **3. Pagination + Search Implementation**

Endpoint:

```
GET /purchase?page=1&limit=10&search=PR0001&status=DRAFT
```

Features:
- Pagination (page, limit, offset)
- Filter status


---

## **4. Webhook – Idempotent Stock Update**

Endpoint:

```
POST /webhook/stock/update
```

Rules:
- Vendor mengirim reference PR + items yang diterima
- Jika reference sudah pernah diproses → skip
- Jika belum → update stock

Agar stock tidak double update

---

## **5. Frontend (Next.js App Router)**

- App Router used correctly.
- Client Components for forms & tables.
- Axios for fetching.
- Pagination terhubung dengan backend.
- Material UI dengan dark mode support.
- Reusable components:
  - `CardSection`
  - `ConfirmModal`
  - `Navbar`

---

# 🌱 Possible Improvements

## 🔧 Backend Improvements
- notifikasi feedback dari hasil webhook untuk mengetahui bahwa status sudah berubah ke completed dari pending

## 🎨 Frontend Improvements
- hooks, httpclient
- pecah component , e.g: button, yang mirip-mirip menjadi lebih kecil agar tidak verbose pada 1 file
