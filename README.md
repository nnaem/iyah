# Install
You have to install the following node modules in the project root directory:
- express
- discord.js-v13-selfbot

You can install them by running the following command in the project root directory:
```bash
npm install express discord.js-v13-selfbot
```

# Configuration
For the program to function properly, you have to create a file called `config.json` in the project root directory. The file should look like this:
```json
{
    "token": "your discord account token here",
    "prefix": "your discord bot prefix here",
    "ownerID": "your discord user id here",
    "password": "your password used for the express auth here"
}
```
You can get your discord token by opening the developer console in the application by pressing `Ctrl + Shift + I`, going to the `Console` tab and pasting this script there:
```js
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```

In the `whitelist-channels.json` file you have to specify the channel IDs accessible by the web server publicly, for the best debugging experience you should be able to read/write in the channel. The file should look like this:
```json
{
    "channelIds": [
        "channelId1",
        "channelId2",
        "channelId3"
    ]
}
```

# Usage
You can start the program by simply running `node .` in the project root directory.

Important: You have to use your external IP address to access the webserver. You can find your external IP address by googling "what is my ip address". I don't know why, but the routes don't work with localhost.