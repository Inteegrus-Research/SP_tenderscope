import express from 'express';
import { getDb } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tenders
// @desc    Get all tenders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    
    const tenders = await db.all(`
      SELECT t.*, u.name as userName
      FROM tenders t
      JOIN users u ON t.userId = u.id
      ORDER BY t.createdAt DESC
    `);
    
    res.json(tenders);
  } catch (err) {
    console.error('Get tenders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tenders/:id
// @desc    Get tender by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    
    const tender = await db.get(`
      SELECT t.*, u.name as userName
      FROM tenders t
      JOIN users u ON t.userId = u.id
      WHERE t.id = ?
    `, [req.params.id]);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    res.json(tender);
  } catch (err) {
    console.error('Get tender error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tenders
// @desc    Create a tender
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;
    
    // Validate input
    if (!title || !description || !lat || !lng) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    const db = await getDb();
    
    const result = await db.run(
      'INSERT INTO tenders (title, description, lat, lng, userId) VALUES (?, ?, ?, ?, ?)',
      [title, description, lat, lng, req.user.id]
    );
    
    const tender = await db.get(`
      SELECT t.*, u.name as userName
      FROM tenders t
      JOIN users u ON t.userId = u.id
      WHERE t.id = ?
    `, [result.lastID]);
    
    res.status(201).json(tender);
  } catch (err) {
    console.error('Create tender error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tenders/:id
// @desc    Update a tender
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;
    
    // Validate input
    if (!title || !description || !lat || !lng) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    const db = await getDb();
    
    // Check if tender exists and belongs to user
    const existingTender = await db.get('SELECT * FROM tenders WHERE id = ?', [req.params.id]);
    
    if (!existingTender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    if (existingTender.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this tender' });
    }
    
    await db.run(
      'UPDATE tenders SET title = ?, description = ?, lat = ?, lng = ? WHERE id = ?',
      [title, description, lat, lng, req.params.id]
    );
    
    const updatedTender = await db.get(`
      SELECT t.*, u.name as userName
      FROM tenders t
      JOIN users u ON t.userId = u.id
      WHERE t.id = ?
    `, [req.params.id]);
    
    res.json(updatedTender);
  } catch (err) {
    console.error('Update tender error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tenders/:id
// @desc    Delete a tender
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    
    // Check if tender exists and belongs to user
    const tender = await db.get('SELECT * FROM tenders WHERE id = ?', [req.params.id]);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    if (tender.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this tender' });
    }
    
    // Delete associated reports first
    await db.run('DELETE FROM reports WHERE tenderId = ?', [req.params.id]);
    
    // Delete the tender
    await db.run('DELETE FROM tenders WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Tender removed' });
  } catch (err) {
    console.error('Delete tender error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tenders/user/me
// @desc    Get current user's tenders
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const db = await getDb();
    
    const tenders = await db.all(`
      SELECT t.*, u.name as userName
      FROM tenders t
      JOIN users u ON t.userId = u.id
      WHERE t.userId = ?
      ORDER BY t.createdAt DESC
    `, [req.user.id]);
    
    res.json(tenders);
  } catch (err) {
    console.error('Get user tenders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;