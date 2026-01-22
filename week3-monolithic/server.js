// server.js
// Task Board - Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// PART 3: MIDDLEWARE CONFIGURATION
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        } else {
            res.json({ tasks: rows });
        }
    });
});

app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching task:', err.message);
            res.status(500).json({ error: 'Failed to fetch task' });
        } else if (!row) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ task: row });
        }
    });
});

app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    
    // Validation: Check if title exists
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    // SQL to insert new task
    const sql = `
        INSERT INTO tasks (title, description, status, priority) 
        VALUES (?, ?, 'TODO', ?)
    `;
    
    db.run(sql, [title, description, priority], function(err) {
        if (err) {
            console.error('Error inserting task:', err.message);
            res.status(500).json({ error: 'Failed to create task' });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    
    // Build dynamic SQL
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    // Add more fields...
    
    // Your code here
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (priority !== undefined) {
        updates.push('priority = ?');
        values.push(priority);
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    db.run(sql, values, function(err) {
        if (err) {
            console.error('Error updating task:', err.message);
            res.status(500).json({ error: 'Failed to update task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
});




app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            res.status(500).json({ error: 'Failed to delete task' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: 'Invalid status. Must be TODO, IN_PROGRESS, or DONE' 
        });
    }

    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Error updating task status:', err.message);
            res.status(500).json({ error: 'Failed to update task status' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task status updated successfully' });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Task Board Server Started!');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📊 Architecture: Monolithic (All-in-one)`);
    console.log(`📝 Database: SQLite (./database/tasks.db)`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));
    console.log('\n💡 Tips:');
    console.log('  - Open http://localhost:3000 in browser');
    console.log('  - Press Ctrl+C to stop server');
    console.log('  - Check README.md for API documentation');
    console.log('\n');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        console.log('Goodbye!\n');
        process.exit(0);
    });
});



// ========================================
// TESTING INSTRUCTIONS
// ========================================

/*
To test your implementation:

1. Make sure database is created:
   cd database
   sqlite3 tasks.db < schema.sql
   cd ..

2. Start the server:
   npm run dev

3. Test with Thunder Client or curl:
   
   GET all tasks:
   curl http://localhost:3000/api/tasks
   
   GET single task:
   curl http://localhost:3000/api/tasks/1
   
   CREATE task:
   curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Task","priority":"HIGH"}'
   
   UPDATE task:
   curl -X PUT http://localhost:3000/api/tasks/1 \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Task"}'
   
   UPDATE status:
   curl -X PATCH http://localhost:3000/api/tasks/1/status \
     -H "Content-Type: application/json" \
     -d '{"status":"DONE"}'
   
   DELETE task:
   curl -X DELETE http://localhost:3000/api/tasks/1

4. Test in browser:
   Open http://localhost:3000
*/


// ========================================
// HINTS & TIPS
// ========================================

/*
SQLITE3 METHODS CHEAT SHEET:
- db.all(sql, params, callback) : Get multiple rows
- db.get(sql, params, callback) : Get single row
- db.run(sql, params, callback) : Execute INSERT/UPDATE/DELETE

CALLBACK PATTERNS:
- (err, rows) for db.all()
- (err, row) for db.get()
- function(err) for db.run() - use 'this.lastID' for inserted ID

ERROR HANDLING:
Always check for errors and return appropriate status codes:
- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 400: Bad Request (validation failed)
- 404: Not Found
- 500: Server Error

VALIDATION:
Always validate user input before database operations!
*/
