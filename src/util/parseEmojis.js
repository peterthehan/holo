const emoji = require('node-emoji');

module.exports = {
  parseServerEmojis: (message) => {
    const string = message.content;

    // match all server emojis, strip non-id characters, and validate
    const serverEmojiRegExp = /:\d+>/gi;
    const serverEmojis = (string.match(serverEmojiRegExp) || [])
      .map(i => i.substring(1, i.length - 1))
      .filter(i => message.guild.emojis.has(i));

    return serverEmojis;
  },
  parseDefaultEmojis: (message) => {
    const string = emoji.unemojify(message.content);

    // match all default emojis, validate, and strip colons
    const defaultEmojiRegExp = /:.*?:/gi;
    const defaultEmojis = (string.match(defaultEmojiRegExp) || [])
      .filter(i => emoji.hasEmoji(i))
      .map(i => i.substring(1, i.length - 1));

    return defaultEmojis;
  },
  parseReactionEmojis: (collected) => {
    const reactionEmojis = collected.keyArray().map(i => {
      if (emoji.hasEmoji(i)) {
        const unemojified = emoji.unemojify(i);
        return unemojified.substring(1, unemojified.length - 1);
      }
      return i;
    });

    return reactionEmojis;
  },
};
