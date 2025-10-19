const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from your frontend

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const results = [];
  const raw = fs.readFileSync(req.file.path, 'utf8');
  const sanitized = raw.replace(/;/g, ',');

  const { Readable } = require('stream');
  const stream = Readable.from([sanitized]);

  stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json({
        success: true,
        fileUrl: `/uploads/${req.file.filename}`,
        parsedData: results,
      });
    });
});

app.use("/uploads", express.static("uploads"));

app.listen(4001, () => console.log("Upload server running at http://localhost:4001"));