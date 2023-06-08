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
/*const getPassword = () => {
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
if (!getPasswordCookie()) getPassword();*/

// Get the password from the user
const getPassword = () => {
    const password = prompt('Enter password:');
    
    // Set the password cookie with the SameSite attribute set to "None" because otherwise it won't work on localhost
    document.cookie = `password=${password}; SameSite=None`;
}

// Get the password cookie (make sure it's not undefined if it's read from localhost)
const getPasswordCookie = () => {
    const cookies = document.cookie.split(';');
    const passwordCookie = cookies.find(cookie => cookie.startsWith('password='));
    return passwordCookie?.split('=')[1];
    
    // If the password cookie is undefined then ask the user for a password
    if (!passwordCookie) getPassword();
}

// Check if the password cookie exists, if not then ask the user for a password
if (!getPasswordCookie()) getPassword();

// Keep track of the currently selected channel ID
let selectedChannelId = null;

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

        // Define the messagesdiv
        const messagesDiv = document.querySelector('.messages-div');

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
                // Only delete messages if changing channels
                if (selectedChannelId !== channelObj.id) {
                    // Delete all messages except the load-more button
                    for (const message of messagesDiv.querySelectorAll('#message:not(#load-more)')) {
                        message.remove();
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

                            // Check if the message has any attachments
                            if (messageObj.attachments && messageObj.attachments.length > 0) {
                                // Create a div to hold the attachments
                                const attachmentsDiv = document.createElement('div');
                                attachmentsDiv.classList.add('attachments-div');

                                // Loop through all the attachments
                                for (const attachment of messageObj.attachmentURL) {
                                    // Check if the attachment has a common image or video extension and if so then display it as an image or video
                                    if (attachment.endsWith('.png') || attachment.endsWith('.jpg') || attachment.endsWith('.jpeg') || attachment.endsWith('.gif')) {
                                        // Create an image element
                                        const image = document.createElement('img');

                                        // Set the image source to the attachment URL
                                        image.src = attachment;

                                        // Append the image to the attachments div
                                        attachmentsDiv.appendChild(image);
                                    } else if (attachment.endsWith('.mp4') || attachment.endsWith('.webm') || attachment.endsWith('.mov')) {
                                        // Create a video element with the controls attribute
                                        const video = document.createElement('video');
                                        video.controls = true;

                                        // Create a source element for the video
                                        const source = document.createElement('source');

                                        // Set the source URL to the attachment URL
                                        source.src = attachment;

                                        // Set the source type to the attachment type
                                        source.type = attachment.endsWith('.mp4') ? 'video/mp4' : attachment.endsWith('.webm') ? 'video/webm' : 'video/quicktime';

                                        // Append the source to the video
                                        video.appendChild(source);

                                        // Append the video to the attachments div
                                        attachmentsDiv.appendChild(video);
                                    } else {
                                        // Create a link element
                                        const link = document.createElement('a');

                                        // Set the link text to the attachment URL
                                        link.textContent = attachment;

                                        // Set the link href to the attachment URL
                                        link.href = attachment;

                                        // Append the link to the attachments div
                                        attachmentsDiv.appendChild(link);
                                    }
                                }

                                // Append the attachments div to the message clone
                                messageClone.appendChild(attachmentsDiv);
                            }

                            // Set the message ID as a data attribute on the message clone
                            messageClone.dataset.messageId = messageObj.id;

                            // Append the message clone to the messages-div at the end
                            messagesDiv.appendChild(messageClone);
                        }
                    }

                    // Set the channel ID as a data attribute on the messages-div element
                    messagesDiv.dataset.channelId = channelObj.id;

                    // Auto scroll to the bottom of the messages-div
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;

                    // Disable click event listener on the channel clones
                    for (const channelClone of channelsDiv.children) {
                        if (channelClone !== channelObj) {
                            channelClone.removeEventListener('click', async () => {});
                        }
                    }

                    // Update the currently selected channel ID
                    selectedChannelId = channelObj.id;
                } else {
                    // Set the loading overlay text to "Failed to fetch messages"
                    overlay.querySelector('h1').textContent = 'Failed to fetch messages, please refresh the page and try again';

                    console.error('Failed to fetch messages');
                }
            });
        }
    });