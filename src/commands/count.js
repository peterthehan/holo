const admin = require('firebase-admin');
const config = require('../config.json');
const { error, } = require('../util/log');
const { pager, } = require('../util/pager');
const {
  aggregateEmojis,
  filterEmojisByType,
  filterEmojisByField,
  countData,
  filterData,
  sortData,
  formatEmojis,
} = require('../util/processEmojis');
const database = admin.database();

countInstructions = (message) => {
  const prefix = !config.prefix ? `@${message.client.user.username} ` : config.prefix;
  const e = {
    title: `${prefix}count [@mention] [all|server|default]`,
    fields: [
      {
        name: '@mention',
        value: `Filter user. If omitted, defaults to include all server members.\n*e.g. ${prefix}count @${message.guild.members.get(config.owner_id).user.username} all*`,
      },
      {
        name: 'all|server|default',
        value: `Filter emojis by type and list emojis by count in descending order.\n*e.g. ${prefix}count all*`,
      },
    ],
  };

  message.channel.send({ embed: e, });
}

countInfo = (message, db, filter, user) => {
  const aggregated = aggregateEmojis(db);
  const data = user != null
    ? filterEmojisByField(filterEmojisByType(aggregated, filter), 'user', user)
    : filterEmojisByType(aggregated, filter);
  const count = filterData(message, countData(data, 'identifier'), filter);
  const sorted = sortData(count, true);

  if (!Object.keys(count).length || !(sorted[0].count + sorted[sorted.length - 1].count)) {
    error(message, '', `I have nothing to show you!`);
    return;
  }

  const formatted = formatEmojis(message, sorted);

  // initialize embed object
  let name;
  let icon_url;
  if (user != null) {
    name = message.guild.members.get(user).user.tag;
    icon_url = message.guild.members.get(user).user.displayAvatarURL;
  } else {
    name = message.guild.name;
    icon_url = message.guild.iconURL;
  }
  const e = { author: { name: name, icon_url: icon_url, }, };

  pager(message, e, sorted, formatted);
}

exports.run = (message, args) => {
  args = args.map(i => i.toLowerCase()); // case-insensitive

  // options are order-insensitive to respect user's efforts
  const filter = args.find(i => ['all', 'server', 'default',].includes(i));
  if (filter) {
    database.ref(`guilds/${message.guild.id}/messages`).once('value', (snapshot) => {
      const db = snapshot.val();
      if (!db) {
        error(message, '', `My records are empty!`);
        return;
      }

      // check @mention
      let user = args.find(i => /<@!?\d+>/.test(i));
      if (user) {
        user = user.replace(/\D/gi, '');
      }

      countInfo(message, db, filter, user);
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  } else {
    countInstructions(message);
  }
}
