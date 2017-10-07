const { parseServerEmojis, parseDefaultEmojis, } = require('../util/parseEmojis');
const { formatEmojis, formatServerData, } = require('../util/formatData');
const { pushEmojis, pushServerData, } = require('../util/pushData');

module.exports = (message) => {
  // ignore bot messages and messages not from guild text channels
  if (message.author.bot || message.channel.type !== 'text') {
    return;
  }

  // parse user message for emojis
  const parsedServerEmojis = parseServerEmojis(message);
  const parsedDefaultEmojis = parseDefaultEmojis(message);
  
  if (parsedServerEmojis.length > 0 || parsedDefaultEmojis.length > 0) {
    // format emoji data for database
    const serverEmojis = formatEmojis(message, parsedServerEmojis, false, false);
    const defaultEmojis = formatEmojis(message, parsedDefaultEmojis, true, false);
    const emojis = serverEmojis.concat(defaultEmojis);

    // format necessary id-to-name pairs for human-readability of data
    const serverData = formatServerData(message, emojis);

    // write changes to firebase via update
    emojis.forEach(i => pushEmojis(message, i));
    serverData.forEach(i => pushServerData(i));

    console.log('********************************************************************************');
    console.log(`${message.author.tag}: ${message.content}`);
    console.log(`Emojis (${emojis.length}): ${emojis.map(i => i.identifier).join(' ')}`);
  }
}
