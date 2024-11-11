const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewar/authMiddleware');
const ProfileController = require('../controllers/ProfileController');

// Create profile (authenticated users only)
router.post('/profile', authenticateToken, ProfileController.createProfile);

// Get profile (authenticated users only)
router.get('/profile', authenticateToken, ProfileController.getProfile);

// Update profile (authenticated users only)

// Delete profile (admin-only access)
router.delete('/profile', authenticateToken, authorizeRole('admin'), ProfileController.deleteProfile);

module.exports = router;
