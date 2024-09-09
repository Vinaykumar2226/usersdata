const express = require("express");
const path = require("path");
const app = express();

// Endpoint to return the JSON file
app.get("/getjson", (req, res) => {
  const filePath = path.join(__dirname, "data.json");

  // Send the JSON file
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to send the JSON file." });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
