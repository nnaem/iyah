// Import discord.js-selfbot-v13
const { Client } = require('discord.js-selfbot-v13');

// Get all the commands from ../commands (ping.js, etc.)
const commands = new Map();
const commandFiles = require('fs').readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
}

// Token from ../config.json
const { token } = require('../config.json');

// Variables
const prefix = require('../config.json').prefix;

// Create client
const client = new Client({ checkUpdate: false });

// On ready, log to console (user name and discriminator, format nicely)
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// On message, check if message starts with prefix and if it's the current user sending the message (delete the message from the message sender)
client.on('message', async message => {
    if (message.content.startsWith(prefix) && message.author.id === client.user.id) {
        message.delete();
    }

    // If the message starts with the prefix and the message author is the current user, run the corresponding command
    if (message.content.startsWith(prefix) && message.author.id === client.user.id) {
        // Get the command name and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get the command
        const command = commands.get(commandName);

        // If the command exists, run it
        if (command) {
            command.run(message, args);
        }
    }
});

// Login with token
client.login(token);

// Export client
module.exports = { client };