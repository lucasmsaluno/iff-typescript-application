import sqlite3 from 'sqlite3';
import { Usuario } from '../models/Usuario';

const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`);

export class UsuarioRepository {
  public async salvar(usuario: Usuario): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [usuario.name, usuario.email, usuario.password], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}
