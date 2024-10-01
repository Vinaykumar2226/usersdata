const { RetoolRPC } = require('retoolrpc');
// const db = require('./db_config'); // Adjust the path if db_config.js is located elsewhere
const {getSegmentCount} = require('../zmp_apis/zmp_phoenix_basic_api')

// const default_api_key = '5bc21b0483dc2722f99f3abdf3aa8bdd'
// const default_account_id = '7'

// const rpc = new RetoolRPC({
//     apiToken: 'retool_01j86yq1qn22f39gtkccdbkv6s',
//     host: 'https://zetaglobalcustomerengineering.retool.com',
//     resourceId: 'ff718e16-29af-49ca-b227-73d28ad7b119',
//     environmentName: 'production',
//     pollingIntervalMs: 1000,
//     version: '0.0.1', // optional version number for functions schemas
//     logLevel: 'info', // use 'debug' for more verbose logging
//   })

const rpc = new RetoolRPC({
    apiToken: 'retool_01j7jwrpq6dsbt4wq48m82gfa4',
    host: 'https://zetaglobalcustomerengineering.retool.com',
    resourceId: '488d4301-8c73-4345-b206-1c11906147ae',
    environmentName: 'production',
    pollingIntervalMs: 1000,
    version: '0.0.1', // optional version number for functions schemas
    logLevel: 'info', // use 'debug' for more verbose logging
})

rpc.register({
    name: 'getSegmentCount',
    arguments: {
        account_id: {type: 'json', 'description': 'Your Account Ids along with api_keys', required: true}
    },
    implementation:async (args, context) => {
        try {
            // console.log(args);
            console.log('RPC initiated _______________')
            console.log(args.account_id)
            const acc_api_keys = Object.values(args.account_id)
            
            // Store all the segments counts in here
            let allSegmentsCount = {};

            // Fetch segment data for each account asynchronously using Promise.all
            const segmentPromises = acc_api_keys.map(async (rest_api_key) => {
                try {
                    const segmentCount = await getSegmentCount(rest_api_key);
                    console.log(rest_api_key + 'total count: ' + segmentCount.res)
                    if (segmentCount.status === 'success') {
                        allSegmentsCount[rest_api_key] = segmentCount.res
                    }
                } catch (error) {
                    // Handle cases where the accountId doesn't exist or other errors occur (like 401)
                    console.log(`Error fetching data for accountId ${accountId.trim()}:`, error.message);
                }
            });

            // Wait for all the promises to resolve
            await Promise.all(segmentPromises);

            // After all the API calls are done, return the collected segments
            return {
                message: allSegmentsCount,
                status: 'success',
                context,
            };
            
        } catch (error) {
            // Handle any errors that occurred during the entire process
            return {
                message: error.message || 'An error occurred',
                status: 'failure',
                context,
            };
        }
    }
})

rpc.listen()

module.exports = {rpc}