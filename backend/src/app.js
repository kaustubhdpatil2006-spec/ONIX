const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// ... existing middleware

app.use('/api/auth', authRoutes);
app.use('/api/scans', uploadRoutes);  // make sure this line is added/updated
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ONIX Backend Running",
  });
});

module.exports = app;