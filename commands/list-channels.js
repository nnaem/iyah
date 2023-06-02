// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Additional imports
const fs = require('fs');
const path = require('path');

// Create client
const client = new Client({ checkUpdate: false });

// Fetch all the whitelisted channels from whitelist-channels.json (handle errors if the file is invalid in any way)
const whitelist = (() => {
    try {
        return require('../whitelist-channels.json');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

// Main run function (reply with a list of all the whitelisted channels, nicely formatted)
const run = async (message) => {
    // Make sure to handle errors
    try {
        // Login with token
        await client.login(require('../config.json').token);

        // Fetch all the channels from the whitelist
        const channels = await Promise.all(whitelist.channelIds.map(async (id) => {
            // Fetch the channel
            const channel = await client.channels.fetch(id).catch(() => null);

            // Return the channel
            return channel;
        }));

        // Reply with the list of channels
        message.reply(`Whitelisted channels:\n${channels.map((channel) => `- ${channel ? `<#${channel.id}>` : 'Unknown channel'}`).join('\n')}`);

        // Delete the reply message after 7 seconds
        setTimeout(() => message.delete(), 7000);
    }
    catch (err) {
        // Reply with the error
        message.reply(`Error: ${err.message}`);

        // Delete the error message after 5 seconds
        setTimeout(() => message.delete(), 5000);
    }

    // Logout
    await client.destroy();
}

// Export the command code and name
module.exports = { run, name: 'list-channels' };