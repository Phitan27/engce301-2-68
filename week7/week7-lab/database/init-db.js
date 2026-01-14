const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'library.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Delete existing database
if (fs.existsSync(dbPath)) {
    console.log('🗑️  Deleting existing database...');
    fs.unlinkSync(dbPath);
}

console.log('📝 Creating new database...');
const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Database created successfully');
    
    // Verify
    db.all('SELECT COUNT(*) as count FROM books', (err, rows) => {
        if (!err) {
            console.log(`📚 Books: ${rows[0].count}`);
        }
        
        db.all('SELECT COUNT(*) as count FROM members', (err, rows) => {
            if (!err) {
                console.log(`👥 Members: ${rows[0].count}`);
            }
            
            db.close();
            console.log('\n✅ Database initialization complete!\n');
        });
    });
});