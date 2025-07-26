import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
let db;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, 'tenderscope.db'),
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function initializeDatabase() {
  const db = await getDb();
  
  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create tenders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tenders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      userId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);
  
  // Create reports table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenderId INTEGER NOT NULL,
      reason TEXT NOT NULL,
      userId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenderId) REFERENCES tenders (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Check if admin user exists, if not create one
  const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@tenderscope.com']);
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@tenderscope.com', hashedPassword, 1]
    );
    console.log('Admin user created');
  }

  // Add some sample tenders if none exist
  const tendersExist = await db.get('SELECT COUNT(*) as count FROM tenders');
  
  if (tendersExist.count === 0) {
    // Create a regular user first
    const userExists = await db.get('SELECT * FROM users WHERE email = ?', ['user@tenderscope.com']);
    
    let userId;
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      const result = await db.run(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        ['Regular User', 'user@tenderscope.com', hashedPassword, 0]
      );
      userId = result.lastID;
      console.log('Regular user created');
    } else {
      userId = userExists.id;
    }

    // Add sample tenders
    const sampleTenders = [
      {
        title: 'Office Building Construction',
        description: 'Seeking contractors for a new 5-story office building in downtown area.',
        lat: 40.7128,
        lng: -74.0060,
        userId
      },
      {
        title: 'Road Maintenance Project',
        description: 'Maintenance and repair of 5km stretch of highway including resurfacing and drainage improvements.',
        lat: 40.7282,
        lng: -73.9942,
        userId
      },
      {
        title: 'Public Park Renovation',
        description: 'Complete renovation of central park including new playground equipment, landscaping, and irrigation systems.',
        lat: 40.7411,
        lng: -74.0018,
        userId
      }
    ];

    for (const tender of sampleTenders) {
      await db.run(
        'INSERT INTO tenders (title, description, lat, lng, userId) VALUES (?, ?, ?, ?, ?)',
        [tender.title, tender.description, tender.lat, tender.lng, tender.userId]
      );
    }
    
    console.log('Sample tenders created');
  }

  return db;
}