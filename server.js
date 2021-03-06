const express = require('express');
const connectDB = require('./config/db');
const route = require('./routes');

const app = express();

app.use(express.json());

// Connect to DB
connectDB();

// Server routing
route(app);

// Define server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});