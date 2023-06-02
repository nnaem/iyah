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

// Main run function (remove a channel from the whitelist by id, handle errors gracefully)
const run = async (message) => {
    // Make sure to handle errors
    try {
        // Login with token
        await client.login(require('../config.json').token);

        // Make sure the user is the owner of the bot
        if (message.author.id !== client.application?.owner?.id) return;

        // Make sure the message has a channel mention
        if (!message.mentions.channels.first()) return message.reply('Please mention a channel to remove from the whitelist.');

        // Get the channel id
        const channelId = message.mentions.channels.first().id;

        // Make sure the channel is whitelisted
        if (!whitelist.channelIds.includes(channelId)) return message.reply('That channel is not whitelisted.');

        // Remove the channel from the whitelist
        whitelist.channelIds.splice(whitelist.channelIds.indexOf(channelId), 1);

        // Update whitelist-channels.json
        fs.writeFileSync(path.join(__dirname, '../whitelist-channels.json'), JSON.stringify(whitelist, null, 4));

        // Reply with a success message
        message.reply(`Successfully removed <#${channelId}> from the whitelist.`);

        // Delete the success message after 5 seconds
        setTimeout(() => message.delete(), 5000);
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
module.exports = { run, name: 'remove-channel' };