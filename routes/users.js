const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
// POST route to insert a new user record
router.post(
  '/add_user',
  upload.fields([{ name: 'file1' }, { name: 'file2' }]),
  async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }
    try {
      const { name, email, phone, checkboxes, dropdown, radio } = req.body;
      const file1 = req.files['file1'][0];
      const file2 = req.files['file2'][0];
      var fs1 = fs.readFileSync(file1.path);
      var fs2 = fs.readFileSync(file2.path);
      // var img = fs.readFileSync(req.file.path);
      var final_file1 = {
        filename: file1.originalname,
        data: fs1,
        contentType: file1.mimetype,
      };
      var final_file2 = {
        filename: file2.originalname,
        data: fs2,
        contentType: file2.mimetype,
      };
      const newUser = new User({
        name,
        email,
        phone,
        checkboxes,
        dropdown,
        radio,
        file1: final_file1,
        file2: final_file2,
      });
      await newUser.save();

      res.status(201).json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error inserting user' });
    }
  }
);

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
