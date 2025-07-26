import express from 'express';
import { getDb } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    Create a report
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { tenderId, reason } = req.body;
    
    // Validate input
    if (!tenderId || !reason) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    const db = await getDb();
    
    // Check if tender exists
    const tender = await db.get('SELECT * FROM tenders WHERE id = ?', [tenderId]);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    // Check if user already reported this tender
    const existingReport = await db.get(
      'SELECT * FROM reports WHERE tenderId = ? AND userId = ?',
      [tenderId, req.user.id]
    );
    
    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this tender' });
    }
    
    const result = await db.run(
      'INSERT INTO reports (tenderId, reason, userId) VALUES (?, ?, ?)',
      [tenderId, reason, req.user.id]
    );
    
    const report = await db.get(`
      SELECT r.*, u.name as userName, t.title as tenderTitle
      FROM reports r
      JOIN users u ON r.userId = u.id
      JOIN tenders t ON r.tenderId = t.id
      WHERE r.id = ?
    `, [result.lastID]);
    
    res.status(201).json(report);
  } catch (err) {
    console.error('Create report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/user
// @desc    Get current user's reports
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const db = await getDb();
    
    const reports = await db.all(`
      SELECT r.*, t.title as tenderTitle
      FROM reports r
      JOIN tenders t ON r.tenderId = t.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `, [req.user.id]);
    
    res.json(reports);
  } catch (err) {
    console.error('Get user reports error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;