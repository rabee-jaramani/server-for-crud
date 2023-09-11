const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
// POST route to insert a new user record
router.post('/add_user', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const { name, email } = req.body;
    var img = fs.readFileSync(req.file.path);
    // var encode_img = img.toString('base64');
    var final_img = {
      filename: req.file.originalname,
      data: img,
      contentType: req.file.mimetype,
    };
    const newUser = new User({
      name,
      email,
      file: final_img,
    });
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

router.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  const writestream = gfs.createWriteStream({
    filename: originalname,
    contentType: mimetype,
  });

  writestream.on('close', (file) => {
    const newFile = new File({
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      uploadDate: file.uploadDate,
    });

    newFile.save((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('File upload failed.');
      } else {
        res.status(201).json({ message: 'File uploaded successfully.' });
      }
    });
  });

  writestream.write(buffer);
  writestream.end();
});
module.exports = router;
