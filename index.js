const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const flattenArrayOfObjects = require('./utils/jsonManipulationMethods').flattenArrayOfObjects


const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Endpoint to return the JSON file
app.get("/users", (req, res) => {
  const filePath = path.join(__dirname, "data.json");

  // Send the JSON file
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to send the JSON file." });
    }
  });
});

// Endpoint that takes comma-separated account_id as URL params
app.get("/users/:account_ids", (req, res) => {
  const accountIds = req.params.account_ids.split(",");
  const cols = req.query.cols ? req.query.cols.split(",") : null;
  const filePath = path.join(__dirname, "data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file." });
    }

    try {
      const usersData = JSON.parse(data);

      // Filter the results based on the account IDs
      const filteredData = usersData.filter((user) =>
        accountIds.includes(user.account_id.toString())
      );

      // If cols parameter is given, filter the keys
      if (cols) {
        const result = filteredData.map((user) => {
          const filteredUser = {};
          cols.forEach((col) => {
            if (user.hasOwnProperty(col)) {
              filteredUser[col] = user[col];
            }
          });
          return filteredUser;
        });
        res.status(200).json(result);
      } else {
        res.status(200).json(filteredData);
      }
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse the JSON file." });
    }
  });
});


// Endpoint that takes comma-separated account_id as URL params
app.get("/users-specific", (req, res) => {
  const accountIds = req.query.ids ? req.query.ids.split(","): null;
  const cols = req.query.cols ? req.query.cols.split(",") : null;
  const filePath = path.join(__dirname, "data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file." });
    }

    try {
      const usersData = JSON.parse(data);

      let filteredData = usersData

      // If ids parameter is given, filter the keys
      if (accountIds){
        filteredData = usersData.filter((user) =>
          accountIds.includes(user.account_id.toString())
        );
      }
      
      console.log(filteredData)
      console.log('__________________---')
      filteredData = flattenArrayOfObjects(filteredData, '__')
      console.log(filteredData)
      // If cols parameter is given, filter the keys
      if (cols) {
        const result = filteredData.map((user) => {
          const filteredUser = {};
          cols.forEach((col) => {
            if (user.hasOwnProperty(col)) {
              filteredUser[col] = user[col];
            } else {
              filteredUser[col] = 'n-a'
            }
          });
          return filteredUser;
        });
        res.status(200).json(result);
      } else {
        res.status(200).json(filteredData);
      }
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse the JSON file." });
    }
  });
});



app.get("/unique-account-ids", (req, res) => {

  const filePath = path.join(__dirname, "data.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file." });
    }

    try {
      const usersData = JSON.parse(data);

      // Create a map to store unique account_id and account_name pairs
      const uniqueAccounts = new Map();

      usersData.forEach((user) => {
        if (!uniqueAccounts.has(user.account_id)) {
          uniqueAccounts.set(user.account_id, user.account_name);
        }
      });

      // Convert map to array of objects
      const result = Array.from(uniqueAccounts, ([account_id, account_name]) => ({
        account_id,
        account_name
      }));

      res.status(200).json(result);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse the JSON file." });
    }
  });
});

