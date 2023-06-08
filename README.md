# Install
1. Clone the repository first with the `git clone https://github.com/nnaem/iyah` command.
- If you don't have git installed, you can download it [here](https://git-scm.com/downloads).
2. Go into the project root directory with the `cd iyah` command.
3. Install the required node modules with the `npm install` command.
- If you don't have node.js installed, you can download it [here](https://nodejs.org/en/download/).
- `npm install express`
- `npm install discord.js-v13-selfbot`
4. Configure the program by following the [configuration](#configuration) section.
5. Start the program by running `node .` in the project root directory.
6. Access the webserver by going to `http://localhost:3000` or `http://your-ip-address:3000` in your browser.
- You can find your external IP address by googling "[what's my ip](https://google.com/search?q=what's+my+ip)".
- If you want to use your external IP address (and let other devices on the internet access it), you have to port forward the port you're using (default is 3000, you can change it in /handlers/web-server.js) in your router control panel/settings.

# Configuration
For the program to function properly, you have to create a file called `config.json` in the project root directory. The file should look like this:
```json
{
    "token": "your discord account token here",
    "prefix": "your discord bot prefix here",
    "ownerID": "your discord user id here",
    "password": "your password used for the web server authentication here"
}
```
You can get your discord token by opening the developer console in the application by pressing `Ctrl + Shift + I`, going to the `Console` tab and pasting this script there:
```js
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```

You can get your discord user ID by enabling developer mode in the application by going to `Settings > Advanced > Developer Mode` and right clicking on your user anywhere on discord.

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
You can start the program by simply running `node .` after configuring in the project root directory.