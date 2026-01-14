-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- TODO: นักศึกษาสร้าง table members
-- ต้องมี: id, name, email (UNIQUE), phone, membership_date, status


-- ===== BORROWINGS TABLE =====
-- TODO: นักศึกษาสร้าง table borrowings
-- ต้องมี: id, book_id (FK), member_id (FK), borrow_date, due_date, return_date, status


-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- TODO: สร้าง indexes สำหรับ members (email)
-- TODO: สร้าง indexes สำหรับ borrowings (book_id, member_id, status)


-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== SAMPLE DATA: Members =====
-- TODO: Insert 3 members


-- ===== SAMPLE DATA: Borrowings =====
-- TODO: Insert 3 borrowings (บางเล่มยืมอยู่, บางเล่มคืนแล้ว)
