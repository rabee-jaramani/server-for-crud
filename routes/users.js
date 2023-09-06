const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
// POST route to insert a new user record
router.post('/add_user', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const { name, email } = req.body;
    const uploadedFile = req.file;
    console.log('Uploaded file is', uploadedFile);
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      file: {
        filename: uploadedFile.originalname.toString(),
        data: uploadedFile.buffer,
        contentType: uploadedFile.mimetype,
      }, // Store the file name in MongoDB
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting user' });
  }
});

router.get('/get_users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});
// Create GridFS stream
let gfs;

mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads'); // Specify the collection name for your files
});

// Route to retrieve an image by filename
router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  console.log(gfs);
  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching image' });
    }

    if (!file) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const readStream = gfs.createReadStream(file.filename);

    // Set the response content type based on the image type (e.g., 'image/jpeg')
    res.set('Content-Type', file.contentType);

    // Pipe the read stream to the response
    readStream.pipe(res);
  });
});
module.exports = router;
