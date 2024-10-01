const { RetoolRPC } = require('retoolrpc');
// const db = require('./db_config'); // Adjust the path if db_config.js is located elsewhere
const {getAdminAccounts} = require('../zmp_apis/zmp_phoenix_admin');
const { authenticateUser } = require('../zmp_apis/tokenAuth');

const rpc = new RetoolRPC({
  apiToken: 'retool_01j7jwrpq6dsbt4wq48m82gfa4',
  host: 'https://zetaglobalcustomerengineering.retool.com',
  resourceId: '131e72ee-bdb0-436e-833c-c2fbd6964ffc',
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1', // optional version number for functions schemas
  logLevel: 'info', // use 'debug' for more verbose logging
})

rpc.register({
    name: 'helloWorld',
    arguments: {
        name: { type: 'string', description: 'Your name', required: true },
        password: { type: 'string', description: 'Your password', required: true },
        page_index: {type: 'number', 'description': 'The Page Number', required: false},
        page_size: {type: 'number', 'description': 'The Page Size', required: false}
    },
    implementation: async (args, context) => {
        try {
            console.log(args)
            // Call the authentication function with the required username and password
            const authData = await authenticateUser(args.name, args.password);
            const res = await getAdminAccounts(authData.id_token, args.page_size, args.page_index);  // Use the ID token
            if (res.res){
                // Return the success message
                return {
                    message: res,
                    status: 'success',
                    context,
                };
            } else {
                return {
                    message: res,
                    status: 'failure',
                    context,
                };
            }
            
        } catch (error) {
            // Handle authentication failure or errors during the process
            return {
                message: error.message || 'Authentication failed',
                status: 'failure',
                context,
            };
        }
    },
})

rpc.listen()

module.exports = {rpc}