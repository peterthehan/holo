const admin = require('firebase-admin');
const { formatServerData, formatUserData, formatEmojiData, } = require('./formatData');
const { log, emojiLog, } = require('./log');
const database = admin.database();

// helper functions
function writeEmojiData(message, data) {
  const path = `guilds/${message.guild.id}/messages/${message.createdAt.getFullYear()}-${message.createdAt.getMonth() + 1}/emojis`;
  const newPostKey = database.ref().child(path).push().key;

  const updates = {};
  updates[`${path}/${newPostKey}`] = data;
  database.ref().update(updates);
}
function writeReadabilityData(data) {
  // console.log(data);
  database.ref(data.path).update(data.updates);
}

module.exports = {
  writeData: (message, emojis, type) => {
    // format necessary id-to-name pairs for human-readability of data
    const serverData = formatServerData(message);
    const userData = formatUserData(message, type === 'Message' ? [] : emojis); // all the emojis are from the message author
    const emojiData = formatEmojiData(message, emojis);
    const data = serverData.concat(userData, emojiData);

    // write changes to firebase via update
    emojis.forEach(i => writeEmojiData(message, i));
    data.forEach(i => writeReadabilityData(i));

    log(message);
    emojiLog(message, emojis, type);
  },
};
