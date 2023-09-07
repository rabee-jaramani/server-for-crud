const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');


// Configure middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://cruduser:cruduser123@clustercrud.ajooqoh.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    const gfs = Grid(db.db, mongoose.mongo);

    // Define storage for multer
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    // Create Mongoose model and schema for your files
    const File = mongoose.model('File', {
        filename: String,
        contentType: String,
        length: Number,
        uploadDate: Date,
    });

    // Define your API endpoints
    app.post('/upload', upload.single('file'), (req, res) => {
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

    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
