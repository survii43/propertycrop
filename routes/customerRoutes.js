const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewar/authMiddleware');
const CustomerController = require('../controllers/CustomerController');


// Create customer (authenticated users only)
router.post('/customer', authenticateToken, CustomerController.createCustomer);

// Get all customers  sssfor the authenticated user
router.get('/customers', authenticateToken, CustomerController.getCustomersByUserId);

// Get a single customer by ID (authenticated users only)
router.get('/customer/:id', authenticateToken, CustomerController.getCustomerById);

// Update customer by ID (authenticated users only)
router.put('/customer/:id', authenticateToken, CustomerController.updateCustomer);

// Delete customer by ID (admin-only access)
router.delete('/customer/:id', authenticateToken, authorizeRole('admin'), CustomerController.deleteCustomer);

module.exports = router;
