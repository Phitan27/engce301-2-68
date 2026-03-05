# 📑 สรุปบทเรียน ENGCE301: สัปดาห์ที่ 7
## Backend & API Design + SQLite Integration

---

## 1. การออกแบบ RESTful API (RESTful API Design)
หลักการออกแบบเพื่อความเป็นมาตรฐานและความคล่องตัวในการสื่อสารระหว่าง Client และ Server

### 🏷️ หลักการตั้งชื่อ Resource
- **ใช้คำนาม (Noun) ไม่ใช้กริยา:** เช่น `/users` แทนที่จะเป็น `/getUsers`
- **ใช้พหูพจน์ (Plural):** เช่น `/orders`, `/products`
- **ตัวพิมพ์เล็กทั้งหมด:** ใช้ `/user-profiles` แทนตัวพิมพ์ใหญ่หรือขีดล่าง

### 🛠️ HTTP Methods & CRUD Operations
| Method | CRUD | Idempotent | หน้าที่ |
| :--- | :--- | :--- | :--- |
| **GET** | **Read** | ✅ ใช่ | ดึงข้อมูล (ไม่แก้ไขข้อมูล) |
| **POST** | **Create** | ❌ ไม่ | สร้างข้อมูลใหม่ |
| **PUT** | **Update** | ✅ ใช่ | แก้ไขข้อมูล (แทนที่ทั้งหมด) |
| **PATCH** | **Update** | ❌ ไม่ | แก้ไขข้อมูล (บางส่วน) |
| **DELETE** | **Delete** | ✅ ใช่ | ลบข้อมูล |

---

## 2. Data Modelling & ER Diagram
หัวใจสำคัญของการออกแบบฐานข้อมูล (Relational Database)

- **Entity:** สิ่งที่เราสนใจเก็บข้อมูล (เช่น User, Product)
- **Attribute:** คุณสมบัติของ Entity (เช่น email, price)
- **Cardinality:** ความสัมพันธ์ระหว่างตาราง
    - **1:1** (One-to-One)
    - **1:N** (One-to-Many) *พบบ่อยที่สุด*
    - **N:M** (Many-to-Many) *ต้องมี Junction Table มาคั่น*



---

## 3. SQLite Database Integration
ฐานข้อมูลแบบไฟล์เดียวที่เปี่ยมประสิทธิภาพสำหรับโปรเจกต์ขนาดกลาง

### 🆚 JSON vs SQLite
- **JSON File:** เหมาะกับงานง่ายๆ แต่ค้นหาช้าเมื่อข้อมูลเยอะ และไม่มี Schema
- **SQLite:** รองรับ **SQL Queries**, **JOIN** ตารางได้ และมีระบบ **Index** ที่รวดเร็ว

### ⚠️ Security: SQL Injection
ห้ามนำตัวแปรไปบวกใน String SQL โดยตรง ให้ใช้ **Prepared Statements (`?`)** เสมอ:
```javascript
// ✅ วิธีที่ถูกต้อง
db.get('SELECT * FROM users WHERE id = ?', [id], callback);
```
---

## 🏗️ 4. Layered Architecture (การแบ่งเลเยอร์โค้ด)
```
เพื่อความสะอาด (Clean Code) และง่ายต่อการ Maintenance

Router: รับ Request และกำหนดเส้นทาง URL

Controller: จัดการ Request/Response (รับ Parameter และส่ง JSON กลับ)

Service: เก็บ Business Logic (การคำนวณ, การ Validation เงื่อนไขต่างๆ)

Database (Data Access): เขียนคำสั่ง SQL ติดต่อกับฐานข้อมูลโดยเฉพาะ

```
---

### 🔑 หัวข้อสำคัญสำหรับการสอบกลางภาค
---
```
JOIN Query: การดึงข้อมูลพร้อมกันจากหลายตาราง

Database Transactions: การใช้ BEGIN, COMMIT, และ ROLLBACK เพื่อป้องกันข้อมูลผิดพลาด (ACID Properties)

Authentication:

bcrypt: การ Hash รหัสผ่านก่อนเก็บลงฐานข้อมูล

JWT (JSON Web Token): การใช้ Token เพื่อยืนยันตัวตนในระบบ Stateless
```
---
### 💡 Tip: สัปดาห์หน้าสอบกลางภาค อย่าลืมทบทวนการวาด UML Diagrams และการออกแบบ API Endpoints ให้แม่นยำครับ! 