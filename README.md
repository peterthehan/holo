<div align="center">
  <p>
    <img src="https://raw.githubusercontent.com/peterthehan/holo/master/assets/holo_banner.png" title="Holo" />
  </p>
  <a href="https://www.npmjs.com/package/discord.js">
    <img src="https://img.shields.io/badge/discord.js-v11.2.1-blue.svg" title="Discord.js" />
  </a>
</div>

## About

Holo is a [Discord](https://discordapp.com/) statistics bot that tracks user emoji usage. Holo is capable of tracking emojis from both messages and message reactions.

Current and relevant server emojis make for happy users!

<div align="center">
  <p>
    <img src="https://raw.githubusercontent.com/peterthehan/holo/master/assets/count.gif" title="Holo" />
  </p>
</div>

## Commands

Prefix: $, @mention

- Bot:
  [about](https://github.com/peterthehan/holo/blob/master/src/commands/about.js),
  [help](https://github.com/peterthehan/holo/blob/master/src/commands/help.js),
  [ping](https://github.com/peterthehan/holo/blob/master/src/commands/ping.js)
- Database:
  [count](https://github.com/peterthehan/holo/blob/master/src/commands/count.js),
  [rate](https://github.com/peterthehan/holo/blob/master/src/commands/rate.js),
  [recommend](https://github.com/peterthehan/holo/blob/master/src/commands/recommend.js),
  [users](https://github.com/peterthehan/holo/blob/master/src/commands/users.js)

## Command Usage

- **$count [@mention] [all|server|default]**  
**@mention**  
Filter user. If omitted, defaults to include all server members.  
*e.g. $count @Miku all*  
**all|server|default**  
Filter emojis by type and list emojis by count in descending order.  
*e.g. $count all*

- **$rate [@mention] [all|server|default]**  
**@mention**  
Filter user. If omitted, defaults to include all server members.  
*e.g. $rate @Miku all*  
**all|server|default**  
Filter emojis by type and list emojis by count per day in descending order.
*e.g. $rate all*

- **$recommend**  
Recommend unused emojis for removal by finding the intersection between the 10 lowest results of the count and rate commands.

- **$users [:emoji:]**  
**:emoji:**  
List emoji users by count in descending order.  
*e.g. $users* :thinking:

## Setup

Holo requires you to host her yourself! Read the following for setup instructions.

#### Firebase Setup

The following instructions assume you are signed in with a Google account.

>Be aware that Firebase has a generous [free plan](https://firebase.google.com/pricing/) for hobbyists but exceeding certain limits will [stop your service](https://firebase.google.com/support/faq/#pricing) for the month. If you're using Holo on a small server, you have almost nothing to worry about.

1. Go to [Firebase](https://firebase.google.com/).
2. Click `GO TO CONSOLE`, located on the site's navigation bar.
3. Create a new project.
4. Go to `Database`, located on the sidebar, and click the `GET STARTED` button.
    1. Under the `DATA` tab, take note of the database URL (e.g. `https://YOUR-PROJECT-NAME-HERE.firebaseio.com/`) associated with your project. You will need this [later](https://github.com/peterthehan/holo#get-holo).
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

>Keep this `serviceAccountKey.json` credentials file **private**!

#### Discord Bot Setup

The following instructions assume you are signed in with a Discord account.

1. Go to Discord's [My Apps](https://discordapp.com/developers/applications/me) page.
2. Create a new app.
3. Click the `Create a Bot User` button and confirm.
4. You can create an invitation link for your bot with `https://discordapp.com/oauth2/authorize?client_id=YOUR_DISCORD_BOT_CLIENT_ID_HERE&scope=bot`.
5. Click `click to reveal` to view your bot's token.

>Keep your Discord bot token and any file containing it **private**!

#### Get Holo

1. Type `git clone https://github.com/peterthehan/holo.git`.
2. Type `cd holo/` and `npm install`.
3. Move the `serviceAccountKey.json` file to the root of the `src` folder.
4. Create a new file named `config.json` at the root of the `src` folder. The file should contain the following:

```js
{
  "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "databaseURL": "YOUR_DATABASE_URL_HERE",
  "reaction_timeout": "30000",
  "pager_timeout": "60000",
  "prefix": "$",
  "owner_id": "YOUR_DISCORD_ACCOUNT_ID_HERE"
}
```

>`token` is from the [Discord Bot Setup](https://github.com/peterthehan/holo#discord-bot-setup) section, step #5.

>`databaseURL` is from the [Firebase Setup](https://github.com/peterthehan/holo#firebase-setup) section, step #4i.

>`reaction_timeout` (in milliseconds) is how long Holo looks at each message for user reactions. Keep it somewhere between 15000 and 30000 for optimal performance.

>`pager_timeout` (in milliseconds) is how long Holo looks at each command message for pagination. Keep it somewhere between 30000 and 60000 for optimal duration.

>`prefix` is your preferred command prefix. If omitted, commands can be used by mentioning the bot in place of the command prefix. *e.g. @Holo ping*

>`owner_id` is your Discord account ID. Navigate to `User Settings` and under the `Appearance` tab, enable `Developer Mode`. Right-click your name to open up the context menu which will display the option to `Copy ID`.

#### Run Holo

1. Type `npm start` or `node src/index.js` to run. Holo is ready to log!

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
