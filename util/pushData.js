const firebase = require('firebase');
const database = firebase.database();

module.exports = {
  pushEmojis: (message, data) => {
    const path = `guilds/${message.guild.id}/messages/${message.createdAt.getFullYear()}-${message.createdAt.getMonth()}`;
    const newPostKey = database.ref().child(path).push().key;

    const updates = {};
    updates[`${path}/${newPostKey}`] = data;
    database.ref().update(updates);
  },
  pushServerData: (data) => {
    database.ref(data.path).update(data.updates);
  },
}
