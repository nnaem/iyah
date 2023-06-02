// Imports
const fs = require('fs');
const path = require('path');

// Create the file "whitelist-channels.json" in our node application root if it doesn't exist with a default empty channelIds array
if (!fs.existsSync(path.join(__dirname, '../whitelist-channels.json'))) {
    fs.writeFileSync(path.join(__dirname, '../whitelist-channels.json'), JSON.stringify({ channelIds: [] }, null, 4));
}

// Create the file "config.json" in our node application root if it doesn't exist with a default empty token and prefix
if (!fs.existsSync(path.join(__dirname, '../config.json'))) {
    fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify({ token: '', prefix: '' }, null, 4));
}

// Export nothing (we just want to run the code)
module.exports = {};