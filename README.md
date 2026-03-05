# 📚 ENGCE301: Software Design and Development
## Week 6: Software Architecture & Express.js CRUD Workshop

เอกสารฉบับนี้สรุปเนื้อหาและรวบรวมโค้ดตัวอย่างทั้งหมดจากสัปดาห์ที่ 6 เกี่ยวกับสถาปัตยกรรมซอฟต์แวร์และการสร้าง RESTful API ด้วย Node.js

---

## 🏗️ 1. Software Architecture Concepts

การออกแบบโครงสร้างที่ดีช่วยให้ระบบบำรุงรักษาได้ง่ายในระยะยาว:
* **Client-Server Architecture:** การแยกส่วนหน้าบ้าน (Frontend) และหลังบ้าน (Backend) ออกจากกัน
* **Layered Architecture:** การแบ่งโค้ดออกเป็นเลเยอร์ เช่น:
    1. **Routes:** กำหนดเส้นทาง URL
    2. **Controllers:** จัดการ Logic ของแต่ละ Route
    3. **Data Access:** การอ่าน/เขียนไฟล์หรือฐานข้อมูล



[Image of Layered Software Architecture diagram]


---

## 🟢 2. Backend Setup (Node.js & Express)

### ขั้นตอนการเตรียมระบบ
```bash
# 1. เริ่มต้นโปรเจกต์
npm init -y

# 2. ติดตั้ง Module ที่จำเป็น
npm install express cors

# 3. ติดตั้ง Nodemon สำหรับรัน Server อัตโนมัติ (Dev Mode)
npm install --save-dev nodemon

การตั้งค่า Scripts (package.json)
JSON
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
📄 3. Backend Implementation (server.js)
โค้ดนี้รวมฟีเจอร์ CRUD สมบูรณ์ พร้อมระบบ Validation และการค้นหา (Search)

JavaScript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper Functions สำหรับจัดการไฟล์ JSON
const readData = () => {
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// 🟢 GET: ดึงข้อมูลทั้งหมด และระบบ SEARCH (Lab Task 2)
app.get('/api/items', (req, res) => {
    try {
        const { search } = req.query;
        let data = readData().items;

        if (search) {
            data = data.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to read data" });
    }
});

// 🔵 POST: เพิ่มข้อมูลใหม่ และ VALIDATION (Lab Task 1)
app.post('/api/items', (req, res) => {
    const { name, price } = req.body;

    // 1. Validation (ตรวจสอบความถูกต้องของข้อมูล)
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Name is required and must be a string" });
    }
    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
    }

    const data = readData();
    const newItem = {
        id: Date.now(), // ใช้ timestamp เป็น ID ชั่วคราว
        name,
        price
    };

    data.items.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

// 🟠 PUT: อัปเดตข้อมูลตาม ID
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.items.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    data.items[index] = { ...data.items[index], ...req.body, id };
    writeData(data);
    res.json(data.items[index]);
});

// 🔴 DELETE: ลบข้อมูลตาม ID
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const newData = data.items.filter(item => item.id !== id);

    if (data.items.length === newData.length) {
        return res.status(404).json({ error: "Item not found" });
    }

    writeData({ items: newData });
    res.json({ message: "Item deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
💻 4. Frontend Integration (script.js)
ตัวอย่างการใช้ fetch() เชื่อมต่อกับ Backend (Lab Task 3)

JavaScript
const API_URL = 'http://localhost:3000/api/items';

// 🟢 ฟังก์ชันโหลดข้อมูล
async function loadItems(searchQuery = '') {
    const response = await fetch(`${API_URL}?search=${searchQuery}`);
    const items = await response.json();
    const container = document.getElementById('app');
    
    container.innerHTML = items.map(item => `
        <div class="card">
            <h3>${item.name}</h3>
            <p>ราคา: ${item.price} บาท</p>
            <button onclick="deleteItem(${item.id})">ลบ</button>
        </div>
    `).join('');
}

// 🔵 ฟังก์ชันเพิ่มข้อมูล
async function addItem() {
    const name = document.getElementById('nameInput').value;
    const price = Number(document.getElementById('priceInput').value);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    });

    if (response.ok) {
        loadItems(); // โหลดข้อมูลใหม่หลังจากเพิ่มสำเร็จ
    } else {
        const err = await response.json();
        alert(err.error);
    }
}
🧪 5. Lab Assignment Checklist
[x] สร้าง Express Server และเชื่อมต่อ data.json

[x] พัฒนา CRUD ครบทุก Method (GET, POST, PUT, DELETE)

[x] เพิ่ม Validation ในฝั่ง Backend (Status 400)

[x] เพิ่มระบบ Search ผ่าน Query Parameters

[x] เชื่อมต่อ Frontend UI ให้ใช้งานได้จริง

End of Week 6 Documentation


**สิ่งที่ต้องทำต่อไป:**
1.  สร้างไฟล์ `data.json` และใส่ข้อมูลตั้งต้นเป็น `{"items": []}`
2.  รันโปรเจกต์ด้วยคำสั่ง `npm run dev`
3.  ใช้ **Postman** ทดสอบแต่ละ Endpoint ก่อนเขียน Frontend เพื่อความมั่นใจครับ!

ต้องการให้ปรับแก้ฟังก์ชันไหนเพิ่มเติมไหมครับ? ตัวอย่างเช่น เพิ่มระบบ Login เบื้องต้น?