// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
var cors = require('cors');
const gridfs = require('gridfs-stream');

const app = express();
const multer = require('multer');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: true }
))

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
  var gfs = gridfs(db.db, mongoose.mongo);
  //   console.log('gfs', gfs);
});
// Define the directory to store uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Change the directory as needed
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
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
app.get('/users/:filename', async (req, res) => {
  const { filename } = req.params;

  if (!gfs) {
    return res.status(500).json({ error: 'GridFS stream is not configured' });
  }
  const file = await gfs.files.findOne({ filename });
  console.log('AAAAAAAAAAAAAAA', file);
  console.log('GGGGGGGGGG', gfs.files);
});
app.get('/download/:filename', async (req, res) => {
  // res.send("dedededed")
  try {
    // console.log(filename)

    const client = new MongoClient('mongodb+srv://cruduser:cruduser123@clustercrud.ajooqoh.mongodb.net/?retryWrites=true&w=majority');
    await client.connect();

    // const db = client.db(dbName);
    const bucket = new GridFSBucket(db);
    // console.log('dbbbbbbbbb', db)
    const filename = req.params.filename;
    const downloadStream = bucket.openDownloadStream(filename);

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    downloadStream.pipe(res);

    downloadStream.on('end', () => {
      client.close();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});