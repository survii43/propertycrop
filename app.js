const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const otpRoutes = require("./routes/otpRoutes");
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api", otpRoutes);
app.use("/api", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
