const { collectMessageEmojis, collectReactionEmojis, } = require('../util/collectEmojis');
const { processCommand, } = require('../util/processCommand');

module.exports = (message) => {
  // ignore bot messages and messages not from guild text channels
  if (message.author.bot || message.channel.type !== 'text') {
    return;
  }

  collectMessageEmojis(message);
  collectReactionEmojis(message);
  processCommand(message);
}
