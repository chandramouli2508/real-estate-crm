const Database = require('better-sqlite3');
try {
  const db = new Database('dev.db');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(r => r.name).join(', '));
  db.close();
  console.log('DB OK!');
} catch(e) {
  console.error('DB Error:', e.message);
}
