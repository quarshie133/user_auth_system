const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
connectDB();

const app = express();


app.use(express.json()); // parse JSON bodies

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/protected', require('./routes/protectedRoutes'));

app.get('/', (req, res) => res.send('Auth API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
