const admin = require('firebase-admin');
const config = require('../config.json');
const { error, } = require('../util/log');
const { pager, } = require('../util/pager');
const {
  aggregateEmojis,
  filterEmojisByType,
  filterEmojisByUser,
  countEmojis,
  sortEmojis,
  formatEmojis,
} = require('../util/processEmojis');
const database = admin.database();

userInstructions = (message) => {
  const prefix = !config.prefix ? `@${message.client.user.username} ` : config.prefix;
  const e = {
    title: `${prefix}user [@mention] [all|server|default] [reverse]`,
    fields: [
      {
        name: '@mention',
        value: `Tag user. If omitted, defaults to self.\n*e.g. ${prefix}user @${message.guild.members.get(config.owner_id).user.username} all*`,
        inline: false,
      },
      {
        name: 'all|server|default',
        value: `List emojis.\n*e.g. ${prefix}user all*`,
        inline: false,
      },
      {
        name: 'reverse',
        value: `List in ascending order.\n*e.g. ${prefix}user all reverse*`,
        inline: false,
      },
    ],
  };

  message.channel.send({ embed: e, });
}

userInfo = (message, db, filter, user, isDescending) => {
  const aggregated = aggregateEmojis(db);
  const data = filterEmojisByUser(filterEmojisByType(aggregated, filter), user);
  if (!data.length) {
    error(message, '', `I have nothing to show you!`);
    return;
  }

  const count = countEmojis(message, data, filter);

  // convert count into an iterable, sort, and format
  const sorted = sortEmojis(count, isDescending);
  const formatted = formatEmojis(message, sorted);

  // initialize embed object
  const e = {
    author: {
      name: message.guild.members.get(user).user.tag,
      icon_url: message.guild.members.get(user).user.displayAvatarURL,
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

      // find user
      const mentionRegExp = /<@!?\d+>/;
      const userIndex = args.findIndex(i => mentionRegExp.test(i));
      const user = userIndex !== -1
        ? args[userIndex].replace(/\D/gi, '')
        : message.author.id;

      const isDescending = !(args.length > 1 && ['reverse', 'r',].some(i => args.includes(i)));
      userInfo(message, db, args[filterIndex], user, isDescending);
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  } else {
    userInstructions(message);
  }
}
