const express = require("express");
const path = require("path");
const app = express();
const adminPage = express.Router();

const fs = require("fs").promises;

// Helper function to extract date from filename
function getDateFromFilename(filename) {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 0; // Invalid date format
  const [, year, month, day] = match;
  return new Date(year, month - 1, day).getTime(); // Convert to timestamp
}

// Define the downloads directory
const downloadsPath = path.join(__dirname, "../", "logs");
//console.log("downloadsPath:", downloadsPath);

// Define allowed file patterns using regex
const allowedFilePatterns = [/^[a-zA-Z]+-\d{4,}-\d{2}-\d{2}\.log$/];

// Middleware to check if file matches allowed patterns
const checkFilePattern = (filename) => {
  return allowedFilePatterns.some((pattern) => pattern.test(filename));
};

// Route to display available files
adminPage.get("/", async (req, res) => {
  try {
    // Read all files from the downloads directory
    const files = await fs.readdir(downloadsPath);

    // Filter files based on allowed patterns
    const allowedFiles = files.filter((file) => checkFilePattern(file));

    // Sort the files based on their dates
    const sortedFiles = allowedFiles.sort((a, b) => {
      const dateA = getDateFromFilename(a);
      const dateB = getDateFromFilename(b);
      return dateB - dateA; // Descending order
    });

    // Create HTML with allowed files
    const fileLinks = sortedFiles
      .map(
        (file) =>
          `<li><a href="/admin/logs/${encodeURIComponent(
            file
          )}">${file}</a></li>`
      )
      .join("");

    res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Available Log Files</title>
            </head>
            <body>
                <h1>Available Log Files for Download</h1>
                <ul>
                    ${fileLinks}
                </ul>
            </body>
            </html>
        `);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).send("Error reading files directory");
  }
});

// Route to handle file downloads
adminPage.get("/logs/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(downloadsPath, filename);

    // Check if file matches allowed patterns
    if (!checkFilePattern(filename)) {
      return res.status(403).send("Access to this file is not allowed");
    }

    // Verify file exists
    await fs.access(filePath);

    // Send file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        if (!res.headersSent) {
          res.status(500).send("Error downloading file");
        }
      }
    });
  } catch (error) {
    console.error("File not found:", error);
    res.status(404).send("File not found");
  }
});

module.exports = adminPage;
