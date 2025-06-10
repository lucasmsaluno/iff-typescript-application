import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`);

export function saveUserToDatabase(name: string, email: string, password: string): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log('saveUserToDatabase');
    console.log(name, email, password);

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}
