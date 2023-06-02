// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Import express and the router
const express = require('express');
const router = express.Router();

// Import the fetchMessages function
const { fetchMessages } = require('../../utils/fetch-messages');

// Create client
const client = new Client({ checkUpdate: false });

// Route handler for /fetch-all-channels
router.get('/', async (req, res) => {
    // Check if the password is correct (Authorization header)
    if (req.headers.authorization !== require('../../config.json').password) return res.status(401).json({ error: 'Unauthorized' });

    // Login with token
    await client.login(require('../../config.json').token);

    // Fetch all the channels from the whitelist-channels.json file, array of channel ids
    // example:
    // {
    //     "channelIds": [
    //         "123456789",
    //         "987654321"
    //     ]
    // }
    const channels = require('../../whitelist-channels.json').channelIds;

    // Create an array to store the channel names and ids
    const channelInfo = [];

    // Loop through all the channels
    for (const channel of channels) {
        // Fetch the channel
        const channelObj = await client.channels.fetch(channel);

        // Add the channel name and id to the array
        channelInfo.push({
            name: channelObj.name,
            id: channelObj.id
        });
    }

    // Send back only the channel names and ids as json
    res.json(channelInfo);

    // Logout
    await client.destroy();
});

// Export the path and the router
module.exports = {
    path: '/fetch-all-channels',
    router: router
}