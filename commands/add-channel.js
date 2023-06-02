// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

// Create client
const client = new Client({ checkUpdate: false });

// Command code
const run = async (message) => {
    // Login with token
    await client.login(require('../config.json').token);

    // Get the argument after the command itself (it's the channel id, ignore the rest)
    const channelId = message.content.split(' ')[1];

    // Check if the channel id is valid with regex, example: 1038623513323520061
    if (!/^\d{16,}$/.test(channelId)) return message.reply('Invalid channel id!');

    // Check if the channel is already in the channelIds array in whitelist-channels.json
    const whitelist = require('../whitelist-channels.json');

    if (whitelist.channelIds.find(id => id === channelId)) {
        return message.reply('Channel is already in the whitelist!');
    }

    // Add the channel id to the whitelist
    require('../whitelist-channels.json').channelIds.push(channelId);

    // Write the new whitelist to the file
    fs.writeFileSync(path.join(__dirname, '..', 'whitelist-channels.json'), JSON.stringify(require('../whitelist-channels.json'), null, 4));

    // Send a message to the channel
    message.reply(`Added channel <#${channelId}> to the whitelist!`);

    // Delete the success message after 5 seconds
    setTimeout(() => message.delete(), 5000);

    // Logout
    await client.destroy();
}

// Export the command code and name
module.exports = { run, name: 'add-channel' };