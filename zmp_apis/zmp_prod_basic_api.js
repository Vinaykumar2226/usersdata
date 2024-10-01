// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');

// // Your credentials
// const username = 'api';
// const password = 'e29499b88c2b62e521e337e54ff6a267';

// // Basic Auth encoded in Base64
// const auth = Buffer.from(`${username}:${password}`).toString('base64');

// // Async function to make the GET request
// async function getExternalReports() {
//     try {
//         const response = await axios.get('https://app.zetaglobal.net/api/v1/unified_segments?per_page=1', {
//             headers: {
//                 'accept': 'application/json',
//                 'Authorization': `Basic ${auth}`,
//             },
//         });
//         const filename = `response_.json`;
//         const filePath = path.join(__dirname, filename);
//         fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), 'utf-8');
//         // console.log('Response Data:', response.data);
//     } catch (error) {
//         console.error('Error fetching data:', error.message);
//     }
// }

// module.exports = { getExternalReports };
