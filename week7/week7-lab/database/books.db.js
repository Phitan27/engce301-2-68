const db = require('./connection');

class BookDatabase {
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน findById
    static findById(id) {
        const sql = 'SELECT * FROM books WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
        return new Promise((resolve, reject) => {
            db.all(sql, [`%${keyword}%`, `%${keyword}%`], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        const sql = `
            INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.category,
            bookData.total_copies || 1,
            bookData.available_copies || 1
        ];
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        const sql = `
            UPDATE books 
            SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?, available_copies = ?
            WHERE id = ?
        `;
        const values = [
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.category,
            bookData.total_copies || 1,
            bookData.available_copies || 1,
            id
        ];
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies + 1
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BookDatabase;