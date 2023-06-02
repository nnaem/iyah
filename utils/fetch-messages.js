// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Create client
const client = new Client({ checkUpdate: false });

// Function to fetch messages from a channel (channel id, amount of messages to fetch (default 25), last message ID to fetch after (optional))
const fetchMessages = async (channelId, amount = 25, lastMessageId) => {
    // Login with token
    await client.login(require('../config.json').token);

    // Fetch the channel (make sure it's valid, otherwise return null)
    const channel = await client.channels.fetch(channelId).catch(() => null);

    // Fetch the messages (define channel.messages first to make sure it's valid, otherwise return null)
    let messages;
    if (lastMessageId) {
        messages = await channel?.messages?.fetch({ limit: amount, after: lastMessageId }).catch(() => null);
    } else {
        messages = await channel?.messages?.fetch({ limit: amount }).catch(() => null);
    }

    // Fetch the author username and discriminator for each message and add it to the message object as authorUsername and authorDiscriminator
    for (const message of messages.values()) {
        message.authorUsername = message.author.username;
        message.authorDiscriminator = message.author.discriminator;
    }

    // Return the messages
    return messages;
}

// Export the function
module.exports = { fetchMessages };