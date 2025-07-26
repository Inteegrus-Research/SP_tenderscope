import express from 'express';
import { getDb } from '../db.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', admin, async (req, res) => {
  try {
    const db = await getDb();
    
    const users = await db.all(`
      SELECT id, name, email, isAdmin, createdAt
      FROM users
      ORDER BY createdAt DESC
    `);
    
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get all reports
// @access  Admin
router.get('/reports', admin, async (req, res) => {
  try {
    const db = await getDb();
    
    const reports = await db.all(`
      SELECT r.*, u.name as userName, t.title as tenderTitle
      FROM reports r
      JOIN users u ON r.userId = u.id
      JOIN tenders t ON r.tenderId = t.id
      ORDER BY r.createdAt DESC
    `);
    
    res.json(reports);
  } catch (err) {
    console.error('Get reports error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reports/:id
// @desc    Update report status
// @access  Admin
router.put('/reports/:id', admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const db = await getDb();
    
    // Check if report exists
    const report = await db.get('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    await db.run(
      'UPDATE reports SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    const updatedReport = await db.get(`
      SELECT r.*, u.name as userName, t.title as tenderTitle
      FROM reports r
      JOIN users u ON r.userId = u.id
      JOIN tenders t ON r.tenderId = t.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    res.json(updatedReport);
  } catch (err) {
    console.error('Update report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', admin, async (req, res) => {
  try {
    const db = await getDb();
    
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const tenderCount = await db.get('SELECT COUNT(*) as count FROM tenders');
    const reportCount = await db.get('SELECT COUNT(*) as count FROM reports');
    const pendingReportCount = await db.get("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
    
    res.json({
      users: userCount.count,
      tenders: tenderCount.count,
      reports: reportCount.count,
      pendingReports: pendingReportCount.count
    });
  } catch (err) {
    console.error('Get stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;