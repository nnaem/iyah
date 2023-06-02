// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Import express and the router
const express = require('express');
const router = express.Router();

// Import the fetchMessages function
const { fetchMessages } = require('../../utils/fetch-messages');

// Create client
const client = new Client({ checkUpdate: false });

// Route to fetch messages from a channel (channel id, amount of messages to fetch (default 25), last message ID to start from (optional))
router.get('/:channelId/:amount?', async (req, res) => {
    // Check if the password is correct (Authorization header)
    if (req.headers.authorization !== require('../../config.json').password) return res.status(401).json({ error: 'Unauthorized' });

    // Login with token
    await client.login(require('../../config.json').token);

    // Fetch the messages
    const messages = await fetchMessages(req.params.channelId, req.params.amount, req.query.lastMessageId);

    // Send back the messages
    res.json(messages);

    // Logout
    await client.destroy();
});

// Export the path and the router
module.exports = {
    path: '/fetch-msgs',
    router: router
}