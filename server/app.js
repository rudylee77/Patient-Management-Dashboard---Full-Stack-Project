const express = require("express");
const cors = require("cors"); // Import the cors package
const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming request bodies
app.use(express.json());

// Use the authRoutes for handling login API requests
app.use("/api", authRoutes);

// Route for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Welcome to the Patient Management Dashboard!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
