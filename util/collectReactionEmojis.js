const emoji = require('node-emoji');
const { parseReactionEmojis, } = require('../util/parseEmojis');
const { formatEmojis, formatServerData, formatUserData, formatEmojiData, } = require('../util/formatData');
const { pushEmojiData, pushData, } = require('../util/pushData');

module.exports = {
  collectReactionEmojis: (message) => {
    const collector = message.createReactionCollector(
      (reaction, user) => !user.bot, // only accept non-bot reactions
      { time: 30000, }
    );

    collector.on(
      'end',
      (collected) => {
        if (collected.size == 0) {
          return;
        }

        // parse message for user reactions
        const parsedReactionEmojis = parseReactionEmojis(collected);

        // parallel array to parsedReactionEmojis of users
        // account for 3 scenarios:
        // 1. only non-bot users react, normal scenario
        // 2. only bot users react, collector above filters them out
        // 3. a mix of both react, filter below
        const users = collected.map(i => i.users.filter(j => !j.bot));

        // format emoji to appropriate form for database
        const emojis = parsedReactionEmojis
          .map((i, index) => {
            return users[index].map(j => {
              return formatEmojis(message, i, j.id, emoji.hasEmoji(i), true);
            });
          })
          .reduce((a, b) => a.concat(b), []); // flatten

        // format necessary id-to-name pairs for human-readability of data
        const serverData = formatServerData(message);
        const userData = formatUserData(message, emojis);
        const emojiData = formatEmojiData(message, emojis);
        const data = serverData.concat(userData, emojiData);

        // write changes to firebase via update
        emojis.forEach(i => pushEmojiData(message, i));
        data.forEach(i => pushData(i));

        console.log('********************************************************************************');
        console.log(`${message.guild.name}|${message.channel.name}|${message.author.tag}: ${message.content}`);
        console.log(`Reaction Emojis (${emojis.length}): ${emojis.map(i => i.isDefault ? i.identifier : message.guild.emojis.get(i.identifier).name).join(' ')}`);
      }
    );
  },
}
