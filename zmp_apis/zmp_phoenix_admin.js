const axios = require('axios');
 
// Async function to get all accounts data
async function getAdminAccounts(token, page_size = 10, page_number = 1) {
    // console.log(token, page_size, page_number)
    try {
        url_ = `https://phoenix.app.zetaglobal.net/v1/admin/accounts?page_size=${page_size}&page=${page_number}`
        // url_2 = 'https://phoenix.app.zetaglobal.net/v1/admin/accounts?page_size=10&page=262'
        // console.log(url_)
        const response = await axios.get(url_, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // console.log('success');
        return {res : response.data, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure'}
        // console.error('Error fetching data:', error.message);
    }
}


// Async function to GET api_key of a single account
async function getApiKeyForSingleAccount(token, acc_id) {
    console.log('in getApiKeyForSingleAccount for: ' + acc_id)
    try {
        url_ = `https://phoenix.app.zetaglobal.net/v1/site_configs?account_id=${acc_id}`
        const response = await axios.get(url_, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return {api_key : response.data.ext_api_keys.filter(x => x.purpose === 'bme_rest')[0].value, id : response.data.id, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure'}
        // console.error('Error fetching data:', error.message);
    }
}





 

module.exports = { getAdminAccounts, getApiKeyForSingleAccount };
