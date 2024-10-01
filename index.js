const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
// const {rpc_1} = require('./retool_rpc_configs/retool_rpc'); // Import the RetoolRPC setup
// const {rpc_2} = require('./retool_rpc_configs/retool_rpc_updated')
const {rpc_segment} = require('./retool_rpc_configs/retool_pls_work')
// const flattenArrayOfObjects = require('./utils/jsonManipulationMethods').flattenArrayOfObjects
// const { getExternalReports } = require('./zmp_prod_basic_api');
// const {getAdminAccounts} = require('./zmp_phoenix_admin');
// const { authenticateUser } = require('./tokenAuth');

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// getExternalReports();
// getAdminAccounts();




// // Endpoint to return the JSON file
// app.get("/users", (req, res) => {
//   const filePath = path.join(__dirname, "data.json");

//   // Send the JSON file
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to send the JSON file." });
//     }
//   });
// });

// Endpoint that takes comma-separated account_id as URL params
app.get("/users", (req, res) => {
  const accountIds = req.query.ids ? req.query.ids.split(","): null;
  const cols = req.query.cols ? req.query.cols.split(",") : null;
  const filePath = path.join(__dirname, "data.json");
  console.log(accountIds, cols)

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

      // If cols parameter is given, filter the keys
      if (cols) {
        const result = filteredData.map((user) => {
          const filteredUser = {};
          cols.forEach((col) => {
            if (user.hasOwnProperty(col)) {
              filteredUser[col] = user[col];
            } else {
              filteredUser[col] = 'NA'
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
  fs.readFile(path.join(__dirname, "data.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file." });
    }

    try {
      const usersData = JSON.parse(data);
      const accountIds = [...new Set(usersData.map((user) => user.account_id))];
      res.status(200).json(accountIds);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse the JSON file." });
    }
  });
});
