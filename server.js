const express = require('express');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

// Root API
app.get('/', (req, res) => {
  res.json({ message: 'Server is running'});
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});