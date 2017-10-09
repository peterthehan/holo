<div align="center">
  <p>
    <img src="https://raw.githubusercontent.com/Johj/holo/master/assets/holo_banner.png" title="Holo" />
  </p>

  <a href="https://www.npmjs.com/package/discord.js">
    <img src="https://img.shields.io/badge/discord.js-v11.2.1-blue.svg" title="Discord.js" />
  </a>
  <a href="https://david-dm.org/Johj/holo">
    <img src="https://img.shields.io/david/Johj/holo.svg" title="Dependencies" />
  </a>
</div>

## About
Holo is a [Discord](https://discordapp.com/) bot that logs emoji usage for analysis.

## Setup
Read the following to host Holo yourself!

#### Get Holo
You will need a Discord account to make a Discord bot.

1. Type `git clone https://github.com/Johj/holo.git`.
2. Type `cd holo/` and `npm install`.
3. Create a new file named `config.json` at the root of the Holo project folder. The file should look like the following:
```js
{
  "token": "YOUR_DISCORD_BOT_TOKEN_HERE"
}
```
Keep your token and the file containing it **private**.

#### Set Up Firebase
You will need a Google account to set up Firebase.

1. Visit [Firebase](https://firebase.google.com/).
2. Click the `GO TO CONSOLE` button located on the navigation bar and on the following page, add a new project.
3. On the sidebar, visit `Database` and go to the `RULES` tab. Set your rules to the following:
```js
// These rules don't allow anyone read or write access to your database
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```
4. On the sidebar, click the gear icon and go to `Project settings`.
5. Under `Settings`, go to the tab `SERVICE ACCOUNTS` and click the `GENERATE NEW PRIVATE KEY` button. This will download a unique file containing Firebase Admin credentials. Keep this file **private**.
6. Rename the file to `serviceAccountKey.json` and move this file to the root of the Holo project folder.

#### Run Holo
1. Type `npm test` or `node index.js` to run. Holo is ready to log!

## Data Format
```js
{
  "guilds" : {
    "258167954913361930" : {
      "channels" : {
        "258167954913361930" : {
          "name" : "general"
        }
      },
      "emojis" : {
        "363631910787874819" : {
          "name" : "Haha",
          "url" : "https://cdn.discordapp.com/emojis/363631910787874819.png"
      },
      "messages" : {
        "2017-9" : {
          "emojis" : {
            "-Kw-LDqFOmFlHKZsoymH" : {
              "channel" : "258167954913361930",
              "identifier" : "363631910787874819",
              "isDefault" : false,
              "isReaction" : false,
              "timestamp" : 1507539348841,
              "user" : "206161807491072000"
            }
          }
        }
      },
      "name" : "cqdb",
      "url" : "https://cdn.discordapp.com/icons/258167954913361930/4cb15bdf376886559a8f8159d4aaa779.jpg"
    }
  },
  "users" : {
    "206161807491072000" : {
      "name" : "Miku#0039",
      "url" : "https://cdn.discordapp.com/avatars/206161807491072000/5720fe7b23f79105d764d6d1ca8cad88.png?size=2048"
    }
  }
}
```