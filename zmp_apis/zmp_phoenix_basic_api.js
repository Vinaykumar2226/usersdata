const axios = require('axios');


// Async function to get all segments data of an account (using api_key)
// make a call to get the total count
// use it in parameter to get all the segments at once
async function getSegmentDataAll(api_key) {
    try {
        console.log('in getSegmentDataAll: ' + api_key)
        const url_one_time = `https://phoenix.app.zetaglobal.net/api/v1/unified_segments?per_page=1`
        const auth = Buffer.from(`api:${api_key}`).toString('base64');
        const response = await axios.get(url_one_time, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
        });
        const total_length = response.data.total
        console.log(api_key + ' total_length: ' + total_length)
        if (total_length) {
            const url_ = `https://phoenix.app.zetaglobal.net/api/v1/unified_segments?per_page=${total_length}`
            // console.log(response)
            const response_all = await axios.get(url_, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Basic ${auth}`,
                },
            });
            return {res: response_all.data, status: 'success'}
        } else {
            throw new Error("Cannot fetch total count of segments");   
        }
        
    } catch (error) {
        return {error: error.message, status: 'failure to fetch segments for the api_key provided'}
        // console.error('Error fetching data:', error.message);
    }
}

// Async function to get segments count of an account (using api_key)
// make a call to get the total count
async function getSegmentCount(api_key) {
    try {
        console.log('in getSegmentCount: ' + api_key)
        const url_one_time = `https://phoenix.app.zetaglobal.net/api/v1/unified_segments?per_page=1`
        const auth = Buffer.from(`api:${api_key}`).toString('base64');
        const response = await axios.get(url_one_time, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
        });
        const total_length = response.data.total || 0
        return {res: total_length, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure to fetch segments for the api_key provided'}
        // console.error('Error fetching data:', error.message);
    }
}

// Async function to get all segments data of an account (using api_key, segment_count)
async function getSegmentDataAllV2(api_key, segment_count) {
    try {
        console.log('in getSegmentDataAllV2: ' + api_key + ' : ' + segment_count)
        const url_ = `https://phoenix.app.zetaglobal.net/api/v1/unified_segments?per_page=${segment_count}`
        const auth = Buffer.from(`api:${api_key}`).toString('base64');
        const response_all = await axios.get(url_, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
        });
        console.log('in getSegmentDataAllV2: ' + api_key + ' : ' + segment_count + ' : success')
        return {res: response_all.data, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure to fetch segments for the api_key provided'}
        // console.error('Error fetching data:', error.message);
    }
}

// Async function to get all segments data of an account (using api_key, segment_count_per_page, page_index)
async function getSegmentDataAllV3(api_key, segment_count_per_page, page_index) {
    try {
        console.log('in getSegmentDataAllV3: ' + api_key + ' : ' + segment_count_per_page + ' : ' + page_index)
        const url_ = `https://phoenix.app.zetaglobal.net/api/v1/unified_segments?per_page=${segment_count_per_page}&page=${page_index}`
        const auth = Buffer.from(`api:${api_key}`).toString('base64');
        const response_all = await axios.get(url_, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
        });
        console.log('in getSegmentDataAllV3: ' + api_key + ' : ' + segment_count_per_page + ' : ' + page_index + ' : success')
        return {res: response_all.data, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure to fetch segments for the api_key provided'}
        // console.error('Error fetching data:', error.message);
    }
}

// Async function to GET child accounts of an account
async function getApiKeyForChildAccounts(api_key, account_id) {
    try {
        // console.log('in getApiKeyForChildAccounts: ' + api_key + ' : ' + account_id)
        const url_ = `https://phoenix.app.zetaglobal.net/v1/user_access_managements/${account_id}/children`
        const auth = Buffer.from(`api:${api_key}`).toString('base64');
        const response_all = await axios.get(url_, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
        });
        // console.log('in getApiKeyForChildAccounts: ' + api_key + ' : ' + account_id + ' : success')
        const res_ = []
        response_all.data.data.forEach(child_acc => {
            res_.push(child_acc.id)
        })
        // console.log('for ' + account_id, ' -------><--- ' , res_)
        return {res: res_, status: 'success'}
    } catch (error) {
        return {error: error.message, status: 'failure to fetch child accounts for the account provided'}
        // console.error('Error fetching data:', error.message);
    }
}


module.exports = { getSegmentDataAll, getSegmentCount, getSegmentDataAllV2, getApiKeyForChildAccounts, getSegmentDataAllV3 };
