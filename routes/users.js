const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// POST route to insert a new user record
router.post('/add_user', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const { name, email } = req.body;
    const uploadedFile = req.file;
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      file: uploadedFile.filename, // Store the file name in MongoDB
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
module.exports = router;
