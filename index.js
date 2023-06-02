// Import handlers and utils
// Web server handler (app and server)
const { handleServer } = require('./handlers/web-server');

// Message handler (client)
const { handleMessage } = require('./handlers/bot-handler');

// Utils
// Create config files if they don't exist
require('./utils/create-config-files');

// Fetch messages from a channel
const { fetchMessages } = require('./utils/fetch-messages');

// Create client
const { client } = require('./handlers/bot-handler');

// Create web server
const server = require('http').createServer(handleServer);