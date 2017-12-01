const admin = require('firebase-admin');
const emoji = require('node-emoji');
const config = require('../config.json');
const { error, } = require('../util/log');
const { pager, } = require('../util/pager');
const {
  aggregateEmojis,
  filterEmojisByField,
  countData,
  sortData,
  formatUsers,
} = require('../util/processEmojis');
const database = admin.database();

usersInstructions = (message) => {
  const prefix = !config.prefix ? `@${message.client.user.username} ` : config.prefix;
  const e = {
    title: `${prefix}users [:emoji:]`,
    fields: [
      {
        name: ':emoji:',
        value: `List emoji users by count in descending order.\n*e.g. ${prefix}users :thinking:*`,
      },
    ],
  };

  message.channel.send({ embed: e, });
}

usersInfo = (message, db, filter) => {
  const aggregated = aggregateEmojis(db);
  const data = filterEmojisByField(aggregated, 'identifier', filter);
  const count = countData(data, 'user');
  const sorted = sortData(count, true);

  if (!Object.keys(count).length || !(sorted[0].count + sorted[sorted.length - 1].count)) {
    error(message, '', `I have nothing to show you!`);
    return;
  }

  const formatted = formatUsers(message, sorted);

  // initialize embed object
  const name = message.guild.name;
  const icon_url = message.guild.iconURL;
  const e = { author: { name: name, icon_url: icon_url, }, };

  pager(message, e, sorted, formatted);
}

exports.run = (message, args) => {
  // options are order-insensitive to respect user's efforts
  let filter = args.find(i => {
    let serverEmojis = i.match(/:\d+>/);
    if (serverEmojis) {
      serverEmojis = serverEmojis[0].substring(1, serverEmojis[0].length - 1);
    }

    return emoji.hasEmoji(i) || message.guild.emojis.has(serverEmojis);
  });
  if (filter) {
    database.ref(`guilds/${message.guild.id}/messages`).once('value', (snapshot) => {
      const db = snapshot.val();
      if (!db) {
        error(message, '', `My records are empty!`);
        return;
      }

      // determine emoji
      filter = emoji.hasEmoji(filter)
        ? emoji.unemojify(filter)
        : filter.match(/:\d+>/)[0];
      filter = filter.substring(1, filter.length - 1);

      usersInfo(message, db, filter);
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  } else {
    usersInstructions(message);
  }
}
