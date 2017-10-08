const admin = require('firebase-admin');
const database = admin.database();

module.exports = {
  pushEmojis: (message, data) => {
    const path = `guilds/${message.guild.id}/messages/${message.createdAt.getFullYear()}-${message.createdAt.getMonth()}/emojis`;
    const newPostKey = database.ref().child(path).push().key;

    const updates = {};
    updates[`${path}/${newPostKey}`] = data;
    database.ref().update(updates);
  },
  pushServerData: (data) => {
    database.ref(data.path).update(data.updates);
  },
}
