// Define a "channel" template for the channel list in channels-div class (this is front-end so only vanilla JS that works in browsers works)
// example:
// <div id="channel">
//     <h3>Channel name</h3>
// </div>
const channel = document.createElement('div');
channel.id = 'channel';
channel.innerHTML = `
    <h3>Channel name</h3>
`;

// Define a "message" template for the message list in messages-div class (this is front-end so only vanilla JS that works in browsers works)
// example:
// <div id="message">
//     <h3>Message author</h3> (this is the message author written as name#discriminator above the message content)
//     <p>Message content</p>
// </div>
const message = document.createElement('div');
message.id = 'message';
message.innerHTML = `
    <h3>Message author</h3>
    <p>Message content</p>
`;

// Get the overlay div
const overlay = document.querySelector('#overlay');

// Ask the user for a password with a prompt and save it in a cookie called "password", make functions for getting and setting cookies too
const getPassword = () => {
    const password = prompt('Enter password:');
    document.cookie = `password=${password}`;
}

const setPassword = (password) => {
    document.cookie = `password=${password}`;
}

const getPasswordCookie = () => {
    const cookies = document.cookie.split(';');
    const passwordCookie = cookies.find(cookie => cookie.startsWith('password='));
    return passwordCookie?.split('=')[1];
}

// Check if the password cookie exists, if not then ask the user for a password
if (!getPasswordCookie()) getPassword();

// Fetch the channel list from the /fetch-all-channels route and display the loading overlay while it's fetching
overlay.style.display = 'block';
overlay.querySelector('h1').textContent = 'Fetching channels...';
fetch(`/fetch-all-channels`, {
    headers: {
        'Authorization': getPasswordCookie()
    }
})
    .then(res => res.json())
    .then(async channels => {
        // Hide the loading overlay
        overlay.style.display = 'none';

        // Create a channel list
        const channelsDiv = document.querySelector('.channels-div');

        // Loop through all the channels
        for (const channelObj of channels) {
            // Create a channel clone from the channel template
            const channelClone = channel.cloneNode(true);

            // Set the channel name to the channel name from the channelObj
            channelClone.querySelector('h3').textContent = `#${channelObj.name}`;

            // Append the channel clone to the channels-div class
            channelsDiv.appendChild(channelClone);

            // Add a click event listener to the channel clone
            channelClone.addEventListener('click', async () => {
                // Check if the current channel ID is different from the ID of the channel you're trying to view messages for
                const currentChannelId = document.querySelector('.messages-div')?.dataset.channelId;
                if (currentChannelId !== channelObj.id) {
                    // Clear the messages-div element (only message elements, not the load more button)
                    const messagesDiv = document.querySelector('.messages-div');
                    while (messagesDiv.firstChild && messagesDiv.firstChild.id === 'message') {
                        messagesDiv.removeChild(messagesDiv.firstChild);
                    }
                }

                // Fetch the messages from the /fetch-msgs route
                const numMessages = 25;
                const lastMessageId = document.querySelector('.messages-div #message:last-child')?.dataset.messageId || 0;
                const url = `/fetch-msgs/${channelObj.id}/${numMessages}${lastMessageId ? `?lastMessageId=${lastMessageId}` : ''}`;
                
                // Display the loading overlay while it's fetching
                overlay.querySelector('h1').textContent = `Fetching ${numMessages} messages...`;
                overlay.style.display = 'block';
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': getPasswordCookie()
                    }
                });
                if (response.ok) {
                    // Hide the loading overlay
                    overlay.style.display = 'none';

                    const messages = await response.json();

                    // Reverse the order of the messages
                    messages.reverse();

                    // Create a message list
                    const messagesDiv = document.querySelector('.messages-div');
                    console.log(messages);
                    // Loop through all the messages
                    for (const messageObj of messages) {
                        // Only add the message if its ID is greater than the last message ID that was displayed
                        if (messageObj.id > lastMessageId) {
                            // Create a message clone from the message template
                            const messageClone = message.cloneNode(true);

                            // Set the message content to the message content from the messageObj
                            messageClone.querySelector('p').textContent = messageObj.content;

                            // Set the message author to the message author from the messageObj
                            messageClone.querySelector('h3').textContent = `${messageObj.authorUsername}#${messageObj.authorDiscriminator}`;

                            // Set the message ID as a data attribute on the message clone
                            messageClone.dataset.messageId = messageObj.id;

                            // Append the message clone to the messages-div at the end
                            messagesDiv.appendChild(messageClone);
                        }
                    }

                    // Set the channel ID as a data attribute on the messages-div element
                    messagesDiv.dataset.channelId = channelObj.id;
                } else {
                    // Set the loading overlay text to "Failed to fetch messages"
                    overlay.querySelector('h1').textContent = 'Failed to fetch messages, please refresh the page and try again';

                    console.error('Failed to fetch messages');
                }
            });
        }
    });