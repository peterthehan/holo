const { parseServerEmojis, parseDefaultEmojis, } = require('../util/parseEmojis');
const { formatEmojis, formatServerData, formatUserData, formatEmojiData, } = require('../util/formatData');
const { pushEmojiData, pushData, } = require('../util/pushData');

module.exports = {
  collectMessageEmojis: (message) => {
    // parse user message for emojis
    const parsedServerEmojis = parseServerEmojis(message);
    const parsedDefaultEmojis = parseDefaultEmojis(message);
    
    if (parsedServerEmojis.length == 0 && parsedDefaultEmojis.length == 0) {
      return
    }
    
    // format emoji to appropriate form for database
    const serverEmojis = parsedServerEmojis.map(i => formatEmojis(message, i, message.author.id, false, false));
    const defaultEmojis = parsedDefaultEmojis.map(i => formatEmojis(message, i, message.author.id, true, false));
    const emojis = serverEmojis.concat(defaultEmojis);

    // format necessary id-to-name pairs for human-readability of data
    const serverData = formatServerData(message);
    const userData = formatUserData(message, []); // all the emojis are from the message author
    const emojiData = formatEmojiData(message, emojis);
    const data = serverData.concat(userData, emojiData);

    // write changes to firebase via update
    emojis.forEach(i => pushEmojiData(message, i));
    data.forEach(i => pushData(i));

    console.log('********************************************************************************');
    console.log(`${message.guild.name}|${message.channel.name}|${message.author.tag}: ${message.content}`);
    console.log(`Message Emojis (${emojis.length}): ${emojis.map(i => i.isDefault ? i.identifier : message.guild.emojis.get(i.identifier).name).join(' ')}`);
  },
}
