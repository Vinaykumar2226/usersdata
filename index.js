// Importing express
const express = require("express");

// Initializing the app
const app = express();

// Define a GET endpoint for /vinay/dummydata
app.get("/vinay/dummydata", (req, res) => {
  const responseData = {
    name: "Vinay",
    some: "thing",
  };

  // Send the JSON response
  res.status(200).json(responseData);
});

// Define a port to listen on
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
