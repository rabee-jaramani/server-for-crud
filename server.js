// Import required modules
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
var cors = require('cors');
const app = express();
const multer = require('multer');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = process.env.MONGODB_URI;
app.use('/users', usersRouter);
const port = process.env.PORT || 5000;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Server is running and Connected to MongoDB');
});
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for storing uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname); // File naming strategy
  },
});
const upload = multer({ storage: storage });

app.get('/users', async (req, res) => {
  let collection = await db.collection('users');
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});
app.get('/', (req, res) => {
  res.send('Hello, CRUD SERVERDKKKKKKKKKKDDD!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
