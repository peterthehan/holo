const admin = require('firebase-admin');
const config = require('../config.json');
const { error, } = require('../util/log');
const { pager, } = require('../util/pager');
const {
  aggregateEmojis,
  filterEmojisByType,
  countEmojis,
  sortEmojis,
  getTotalCount,
  formatEmojis,
} = require('../util/processEmojis');
const database = admin.database();

serverInstructions = (message) => {
  const prefix = !config.prefix ? `@${message.client.user.username} ` : config.prefix;
  const e = {
    title: `${prefix}server [all|server|default] [reverse]`,
    fields: [
      {
        name: 'all|server|default',
        value: `List emojis.\n*e.g. ${prefix}server all*`,
        inline: false,
      },
      {
        name: 'reverse',
        value: `List in ascending order.\n*e.g. ${prefix}server all reverse*`,
        inline: false,
      },
    ],
  };

  message.channel.send({ embed: e, });
}

serverInfo = (message, db, filter, isDescending) => {
  const aggregated = aggregateEmojis(db);
  const data = filterEmojisByType(aggregated, filter);
  const count = countEmojis(message, data, filter);
  const sorted = sortEmojis(count, isDescending);
  if (!Object.keys(count).length || !getTotalCount(sorted)) {
    error(message, '', `I have nothing to show you!`);
    return;
  }

  const formatted = formatEmojis(message, sorted);

  // initialize embed object
  const e = {
    author: {
      name: message.guild.name,
      icon_url: !message.guild.iconURL ? '' : message.guild.iconURL,
    },
  };

  pager(message, e, sorted, formatted);
}

exports.run = (message, args) => {
  args = args.map(i => i.toLowerCase());
  const filterIndex = args.findIndex(i => ['all', 'server', 'default',].includes(i));

  // options are order-insensitive to respect user's efforts
  // must have a valid option
  if (filterIndex !== -1) {
    database.ref(`guilds/${message.guild.id}/messages`).once('value', (snapshot) => {
      const db = snapshot.val();
      if (!db) {
        error(message, '', `My records are empty!`);
        return;
      }

      const isDescending = !(args.length > 1 && ['reverse', 'r',].some(i => args.includes(i)));
      serverInfo(message, db, args[filterIndex], isDescending);
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  } else {
    serverInstructions(message);
  }
}
