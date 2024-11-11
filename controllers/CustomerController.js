const db = require("../config/db");

// Create a new customer
exports.createCustomer = async (req, res) => {
    const { firstName, lastName, phone, email } = req.body;
    const userId = req.user.id;

    // Validation for required fields
    if (!firstName || !lastName || !phone || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if a customer already exists with the provided email
        const [existingCustomer] = await db.query("SELECT * FROM customers WHERE email = ?", [email]);
        if (existingCustomer.length > 0) {
            return res.status(409).json({ message: "Customer with this email already exists" });
        }

        // Insert new customer record
        const [result] = await db.query(
            "INSERT INTO customers (first_name, last_name, phone, email, user_id) VALUES (?, ?, ?, ?, ?)",
            [firstName, lastName, phone, email, userId]
        );
        res.status(201).json({ message: "Customer created successfully", customerId: result.insertId });
    } catch (err) {
        console.error("Error creating customer:", err);
        res.status(500).json({ error: "Failed to create customer", details: err.message });
    }
};

// Get a specific customer by ID
exports.getCustomerById = async (req, res) => {
    const { id } = req.params;

    try {
        const [customer] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
        if (customer.length > 0) {
            res.json(customer[0]);
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        console.error("Error fetching customer:", err);
        res.status(500).json({ error: "Failed to retrieve customer", details: err.message });
    }
};

// Get all customers for a specific user
exports.getCustomersByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const [customers] = await db.query("SELECT * FROM customers WHERE user_id = ?", [userId]);
        res.json(customers);
    } catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to retrieve customers", details: err.message });
    }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, email } = req.body;

    if (!firstName || !lastName || !phone || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [result] = await db.query(
            "UPDATE customers SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?",
            [firstName, lastName, phone, email, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: "Customer updated successfully" });
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        console.error("Error updating customer:", err);
        res.status(500).json({ error: "Failed to update customer", details: err.message });
    }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM customers WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.json({ message: "Customer deleted successfully" });
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ error: "Failed to delete customer", details: err.message });
    }
};
