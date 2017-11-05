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
Holo is a [Discord](https://discordapp.com/) bot that logs emoji usage for analysis. Holo is capable of tracking emojis from both messages and message reactions.

## Setup
Read the following to host Holo yourself!

#### Set Up Firebase
The following instructions assume you are signed in with a Google account.

1. Go to [Firebase](https://firebase.google.com/).
2. Click `GO TO CONSOLE`, located on the site's navigation bar.
3. Create a new project.
4. Go to `Database`, located on the sidebar, and click the `GET STARTED` button.
    * Under the `DATA` tab, take note of the database URL (e.g. `https://your-project-name.firebaseio.com/`) associated with your project. You will need this [later](https://github.com/Johj/holo#get-holo).
5. Go to the `RULES` tab and set your rules to the following:

```js
// These rules don't allow anyone read or write access to your database
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

6. On the sidebar, click the gear icon and go to `Project settings`.
7. Go to the `SERVICE ACCOUNTS` tab and click the `GENERATE NEW PRIVATE KEY` button. This will download a unique file containing Firebase Admin credentials.
8. Rename the file to `serviceAccountKey.json`.

>Keep this credentials file **private**!

#### Set Up Discord Bot
The following instructions assume you are signed in with a Discord account.

1. Go to Discord's [My Apps](https://discordapp.com/developers/applications/me) page.
2. Create a new app.
3. Click the `Create a Bot User` button and confirm.
4. You can create an invitation link for your bot with `https://discordapp.com/oauth2/authorize?client_id=YOUR_DISCORD_BOT_CLIENT_ID_HERE&scope=bot`.
5. Click `click to reveal` to view your bot's token.

>Keep your Discord bot token and any file containing it **private**!

#### Get Holo

1. Type `git clone https://github.com/Johj/holo.git`.
2. Type `cd holo/` and `npm install`.
3. Move the `serviceAccountKey.json` file to the root of the Holo project folder.
4. Create a new file named `config.json` at the root of the Holo project folder. This file should look like the following:

```js
{
  "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "databaseURL": "YOUR_DATABASE_URL_HERE",
  "reaction_timeout": "30000",
  "pager_timeout": "60000",
  "prefix": ",",
  "owner_id": "206161807491072000"
}
```

>`reaction_timeout` (in milliseconds) is how long Holo looks at each message for user reactions. Keep it somewhere between 15000 and 30000 for optimal performance.

>`pager_timeout` (in milliseconds) is how long Holo looks at each command message for pagination. Keep it somewhere between 30000 and 60000 for optimal duration.

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