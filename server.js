// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
var cors = require('cors');
const app = express();
const multer = require('multer');
app.use(cors());
app.use(bodyParser.json());
app.use('/users', usersRouter);
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello, CRUD SERVERDKKKKKKKKKKDDD!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
mongoose.connect(
  'mongodb+srv://cruduser:cruduser123@clustercrud.ajooqoh.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Server is running and Connected to MongoDB');
});
// Define the directory to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Change the directory as needed
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
