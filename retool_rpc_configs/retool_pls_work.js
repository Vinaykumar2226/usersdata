const { RetoolRPC } = require('retoolrpc');
const { authenticateUser } = require('../zmp_apis/tokenAuth');
const { getApiKeyForSingleAccount } = require('../zmp_apis/zmp_phoenix_admin')
const { getSegmentCount, getSegmentDataAll, getSegmentDataAllV2, getApiKeyForChildAccounts, getSegmentDataAllV3 } = require('../zmp_apis/zmp_phoenix_basic_api')

const default_api_key = '5bc21b0483dc2722f99f3abdf3aa8bdd'
const default_account_id = '7'

const rpc = new RetoolRPC({
  apiToken: 'retool_01j8ek2txy6zfp50y8w6f06krn',
  host: 'https://zetaglobalcustomerengineering.retool.com',
  resourceId: 'bdc7e15a-ea8e-4b9b-9edc-dacc1d6b42f6',
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1', // optional version number for functions schemas
  logLevel: 'info', // use 'debug' for more verbose logging
})

// fetch segments V1 (dont use)
// takes in name/password/accountIDs (comma seperated)
// does auth, split accounts
// for each account
//  get api_key
//  get count
//  get all the segments at once
rpc.register({
  name: 'fetch_segments',
  arguments: {
    name: { type: 'string', description: 'Your name', required: true },
    password: { type: 'string', description: 'Your password', required: true },
    account_id: {type: 'string', 'description': 'Your Account Ids (Comma Seperated)', required: true}
  },
  implementation:async (args, context) => {
        try {
            // console.log(args);
            console.log('RPC initiated _______________')

            // Authenticate the user to get the token
            const authData = await authenticateUser(args.name, args.password);

            // Split account_id string by commas to get an array of account_ids
            const accountIds = args.account_id.split(',');
            console.log(accountIds)
            // Store all the segments in an array
            let allSegments = [];

            // Fetch segment data for each account asynchronously using Promise.all
            const segmentPromises = accountIds.map(async (accountId) => {
                try {
                    // Fetch the API key for the current account
                    const res = await getApiKeyForSingleAccount(authData.id_token, accountId.trim());
                    
                    const rest_api_key = res.api_key;
                    if (rest_api_key === default_api_key && accountId !== default_account_id){
                        console.log(`api key for accountId: ${accountId} doesn't exist`)
                    }
                    else {
                        console.log(rest_api_key)
                        // Fetch the segments for the current account
                        const segmentResponse = await getSegmentDataAll(rest_api_key);
    
                        // If successful, push the segment data to the allSegments array
                        if (segmentResponse.status === 'success') {
                            segmentResponse.res.data.forEach(seg => allSegments.push(seg))
                        }
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
                message: allSegments,
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

// fetch_api_keys
rpc.register({
    name: 'fetch_api_keys',
    arguments: {
      name: { type: 'string', description: 'Your name', required: true },
      password: { type: 'string', description: 'Your password', required: true },
      account_id: {type: 'string', 'description': 'Your Account Ids Comma Seperated', required: true}
    },
    implementation:async (args, context) => {
          try {
                // console.log(args);
                console.log('RPC initiated _______________')

                // Authenticate the user to get the token
                const authData = await authenticateUser(args.name, args.password);
  
                // Split account_id string by commas to get an array of account_ids
                const accountIds = args.account_id.split(',');
                console.log(accountIds)

                const account_id_api_keys = {}

                const accountPromises = accountIds.map(async (accountId) => {
                    try {
                        // Fetch the API key for the current account
                        const res = await getApiKeyForSingleAccount(authData.id_token, accountId.trim());
                        const rest_api_key = res.api_key;
                        if (rest_api_key === default_api_key && accountId !== default_account_id){
                            console.log(`api key for accountId: ${accountId} doesn't exist`)
                            account_id_api_keys[accountId] = null
                        } else {
                            console.log(accountId, + ' => ' + rest_api_key)
                            account_id_api_keys[accountId] = rest_api_key
                        }
                    } catch (error) {
                        // Handle cases where the other errors occur (like 401)
                        console.log(`Error fetching data for accountId ${accountId.trim()}:`, error.message);
                    }
                })
              
                
                // Wait for all the promises to resolve
                await Promise.all(accountPromises);
    
                // After all the API calls are done, return the collected segments
                return {
                    message: account_id_api_keys,
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


/*
given : myObj = {
    "key1": 10,
    "key2": 5,
    "key3": 7,
};

returns: 
[
   { api_key: "key1", count: 10 },
   { api_key: "key2", count: 5 },
   { api_key: "key3", count: 7 }
]
*/
const transformToApiKeyArray = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
        return { api_key: key, count: value };
    });
}

// auth v2
rpc.register({
    name: 'token_auth_v2',
    arguments: {
      name: { type: 'string', description: 'Your name', required: true },
      password: { type: 'string', description: 'Your password', required: true }
    },
    implementation: async (args, context) => {
        try {
            // Authenticate the user to get the token
            const authData = await authenticateUser(args.name, args.password);
            return {
                id_token: authData.id_token,
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

// // enable child account extraction
// if (enable_child_extraction) {
//     // get the child accounts in an array of obj (with api_key and account name)
//     // console.log(account_id_api_keys, account_id_names)
//     const the_children = await getApiKeyForChildAccounts(rest_api_key, accountId)
//     // add it to account_id_api_keys and account_id_names in a loop
//     the_children.res.forEach(childObj => {
//         account_id_api_keys[childObj.account_id] = childObj.api_key
//         account_id_names[childObj.account_id] = childObj.account_name
//     })
//     // console.log(the_children)
//     // console.log(account_id_api_keys, account_id_names)
// }

// fetch child accounts v2
rpc.register({
    name: 'fetch_child_accounts_v2',
    arguments: {
        account_id_api_key_obj: {type: 'json', 'description': 'Parent Account Ids along with api_keys', required: true}
    },
    implementation:async (args, context) => {
        try {
            const acc_api_keys = Object.entries(args.account_id_api_key_obj)
            const all_child_accounts = []

            // Fetch segment data for each account asynchronously using Promise.all
            const childPromises = acc_api_keys.map(async ([account_id, rest_api_key]) => {
                try {
                    const child_accounts = await getApiKeyForChildAccounts(rest_api_key, account_id);
                    console.log(rest_api_key + ' child accounts: ' + child_accounts.res)
                    if (child_accounts.status === 'success') {
                        all_child_accounts.push(...child_accounts.res)
                    }
                } catch (error) {
                    // Handle cases where the accountId doesn't exist or other errors occur (like 401)
                    console.log(`Error fetching data for accountId ${account_id.trim()}:`, error.message);
                }
            });

            // Wait for all the promises to resolve
            await Promise.all(childPromises);

            all_child_accounts

            // After all the API calls are done, return the collected segments
            return {
                message: all_child_accounts,
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

// fetch api_keys v2

rpc.register({
    name: 'fetch_api_keys_v2',
    arguments: {
      account_id: {type: 'string', description: 'Your Account Ids Comma Seperated', required: true},
      id_token: {type: 'string', description : 'Your Token String for Auth', required: true}
    },
    implementation:async (args, context) => {
        try {
            // Split account_id string by commas to get an array of account_ids
            const accountIds = args.account_id.split(',');
            const account_id_api_keys = {}
            const account_id_names = {}
            const accountPromises = accountIds.map(async (accountId) => {
                try {
                    // Fetch the API key for the current account
                    const res = await getApiKeyForSingleAccount(args.id_token, accountId.trim());
                    const rest_api_key = res.api_key;
                    const account_name = res.id
                    if (rest_api_key === default_api_key && accountId !== default_account_id){
                        account_id_api_keys[accountId] = null
                        account_id_names[accountId] = null
                    } else {
                        console.log(accountId, + ' => ' + rest_api_key + ' => ' + account_name)
                        account_id_api_keys[accountId] = rest_api_key
                        account_id_names[accountId] = account_name
                    }
                } catch (error) {
                    // Handle cases where the other errors occur (like 401)
                    console.log(`Error fetching data for accountId ${accountId.trim()}:`, error.message);
                }
            })
            // Wait for all the promises to resolve
            await Promise.all(accountPromises);
            // After all the API calls are done, return the collected segments
            return {
                api_keys: account_id_api_keys,
                account_names: account_id_names,
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



// fetch segments v2
rpc.register({
    name: 'fetch_segments_v2',
    arguments: {
      acc_api_key_with_count: {type: 'json', 'description': 'Your Account Ids API Key mapped with count', required: true}
    },
    implementation:async (args, context) => {
        try {
            console.log('RPC initiated _______________' + args.acc_api_key_with_count)
            let allSegments = [];
            const accountIds = transformToApiKeyArray(args.acc_api_key_with_count)
            // Fetch segment data for each account asynchronously using Promise.all
            const segmentPromises = accountIds.map(async ({api_key, count}) => {
                try { 
                    // Fetch the segments for the current account
                    const segmentResponse = await getSegmentDataAllV2(api_key, count);

                    // If successful, push the segment data to the allSegments array
                    if (segmentResponse.status === 'success') {
                        allSegments.push(...segmentResponse.res.data)
                        // segmentResponse.res.data.forEach(seg => allSegments.push(seg))
                    }
                    
                } catch (error) {
                    // Handle cases where the accountId doesn't exist or other errors occur (like 401)
                    console.log(`Error fetching data for key: ${api_key}:`, error.message);
                }
            });

            // Wait for all the promises to resolve
            await Promise.all(segmentPromises);

            console.log('returning allSegmentsV2')
            // After all the API calls are done, return the collected segments
            return {
                message: allSegments,
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


// fetch segments v3
rpc.register({
    name: 'fetch_segments_v3',
    arguments: {
      api_key: {type: 'string', 'description': 'Your Account Ids API Key', required: true},
      page_number: {type: 'number', 'description': 'Your Account Ids Segment Retrieval Page Index', required: true}
    },
    implementation:async (args, context) => {
        try {
            console.log('RPC initiated _______________')
            let segments = [];
            try {
                const segmentResponse = await getSegmentDataAllV3(args.api_key, 100, args.page_number);
                if (segmentResponse.status === 'success') {
                    segments = segmentResponse.res.data
                }
            } catch (error) {
                // Handle cases where the accountId doesn't exist or other errors occur (like 401)
                console.log(`Error fetching data for key: ${api_key}:`, error.message);
            }

            


            console.log('returning allSegmentsV3')
            // After all the API calls are done, return the collected segments
            return {
                message: segments,
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
  
// get segment count v2
rpc.register({
    name: 'getSegmentCount',
    arguments: {
        account_id: {type: 'json', 'description': 'Your Account Ids along with api_keys', required: true}
    },
    implementation:async (args, context) => {
        try {
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
//4136,4111,4222,4333,4444,4123
module.exports = {rpc}

/*
async (args, context) => {
    try {
        console.log(args)
        // generatedAuthToken
        const authData = await authenticateUser(args.name, args.password);
        // getAPIToken

        // for loop for each args.account_id (split by ,)
        const res = await getApiKeyForSingleAccount(authData.id_token, args.account_id)
        const rest_api_key = res.res_.ext_api_keys.filter(x => x.purpose === 'bme_rest')[0].value
        console.log(rest_api_key)

        // getAllSegments
        const segmentResponse = await getSegmentDataAll(rest_api_key)
        console.log(segmentResponse)
        // const res = await getAdminAccounts(authData.id_token, args.page_size, args.page_index);  // Use the ID token
        if (segmentResponse){
            // Return the success message
            return {
                message: segmentResponse,
                status: 'success',
                context,
            };
        } else {
            return {
                message: segmentResponse,
                status: 'failure',
                context,
            };
        }
        // for ends here
        
    }
*/