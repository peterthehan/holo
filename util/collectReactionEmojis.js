const emoji = require('node-emoji');
const { parseReactionEmojis, } = require('../util/parseEmojis');
const { formatEmojis, formatServerData, formatUserData, formatEmojiData, } = require('../util/formatData');
const { pushEmojiData, pushData, } = require('../util/pushData');

module.exports = {
  collectReactionEmojis: (message) => {
    const collector = message.createReactionCollector(
      () => true, // no filter, get all reactions
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
        const users = collected.map(i => i.users);

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
