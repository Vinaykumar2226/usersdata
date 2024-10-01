const axios = require('axios');

// Async function to make the POST request
async function authenticateUser(username, password) {
    const url = 'https://boomtrain.auth0.com/oauth/ro';
    
    const requestBody = {
        client_id: "FP3iP1blgJbdmmSRYS1I96byb1nXryTs",
        connection: "Username-Password-Authentication",
        scope: "openid app_metadata name email user_id",
        grant_type: "password",
        username: username,
        password: password
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        });

        console.log('id_token:', response.data.id_token);
        return response.data; // You can return the response data for further use

    } catch (error) {
        // console.error('Error during authentication:', error.message);
        throw error; // Rethrow the error so it can be handled in the caller function
    }
}

// Export the function to use it in other files
module.exports = { authenticateUser };
