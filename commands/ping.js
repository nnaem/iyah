// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Create the command code
const run = async (message) => {
    // Send pong
    message.channel.send('pong');
}

// Export the command code and name
module.exports = { run, name: 'ping' };