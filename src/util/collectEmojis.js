const emoji = require('node-emoji');
const config = require('../config.json');
const { parseServerEmojis, parseDefaultEmojis, parseReactionEmojis, } = require('./parseEmojis');
const { formatEmojis, } = require('./formatData');
const { writeData, } = require('./writeData');

module.exports = {
  collectMessageEmojis: (message) => {
    // parse user message for emojis
    const parsedServerEmojis = parseServerEmojis(message);
    const parsedDefaultEmojis = parseDefaultEmojis(message);
    
    if (parsedServerEmojis.length == 0 && parsedDefaultEmojis.length == 0) {
      return;
    }
    
    // format emoji to appropriate form for database
    const serverEmojis = parsedServerEmojis.map(i => formatEmojis(message, i, message.author.id, false, false));
    const defaultEmojis = parsedDefaultEmojis.map(i => formatEmojis(message, i, message.author.id, true, false));
    const emojis = serverEmojis.concat(defaultEmojis);

    writeData(message, emojis, 'Message');
  },
  collectReactionEmojis: (message) => {
    const collector = message.createReactionCollector(
      (reaction, user) => !user.bot, // only accept non-bot reactions
      { time: parseInt(config.reaction_timeout, 10), }
    );

    collector.on('end', (collected) => {
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

      writeData(message, emojis, 'Reaction');
    });
  },
};
