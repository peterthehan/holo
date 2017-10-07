const emoji = require('node-emoji');

module.exports = {
  parseServerEmojis: (message) => {
    const string = message.content;
    const serverEmojiList = message.guild.emojis.map(i => i.id);

    // match all server emojis, strip non-id characters, and validate
    const serverEmojiRegExp = /:\d+>/gi;
    const serverEmojis = (string.match(serverEmojiRegExp) || [])
      .map(i => i.substring(1, i.length - 1))
      .filter(i => serverEmojiList.includes(i));

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
}
