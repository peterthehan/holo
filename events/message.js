const { collectReactionEmojis, } = require('../util/collectReactionEmojis');
const { collectMessageEmojis, } = require('../util/collectMessageEmojis');

module.exports = (message) => {
  // ignore bot messages and messages not from guild text channels
  if (message.author.bot || message.channel.type !== 'text') {
    return;
  }

  collectReactionEmojis(message);
  collectMessageEmojis(message);
}
