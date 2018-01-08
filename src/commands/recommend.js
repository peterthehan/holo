const admin = require('firebase-admin');
const config = require('../config.json');
const { error, } = require('../util/log');
const {
  aggregateEmojis,
  filterEmojisByType,
  countData,
  filterData,
  calculateRate,
  sortData,
} = require('../util/processEmojis');
const database = admin.database();

recommendInfo = (message, db) => {
  const aggregated = aggregateEmojis(db);
  const data = filterEmojisByType(aggregated, 'server');
  const count = filterData(message, countData(data, 'identifier'), 'server');
  const rate = calculateRate(message, count);
  const countSorted = new Set(sortData(count, false).slice(0, 10).map(i => i.identifier));
  const rateSorted = new Set(sortData(rate, false).slice(0, 10).map(i => i.identifier));

  const intersection = [...countSorted].filter(i => rateSorted.has(i));

  if (!intersection.length) {
    error(message, '', `I have nothing to show you!`);
  } else {
    // initialize embed object
    const e = {
      title: 'I recommend removing...',
      description: intersection.map(i => message.guild.emojis.get(i)).join(''),
      author: { name: message.guild.name, icon_url: message.guild.iconURL, },
    };

    message.channel.send({ embed: e, });    
  }
}

exports.run = (message, args) => {
  database.ref(`guilds/${message.guild.id}/messages`).once('value', (snapshot) => {
    const db = snapshot.val();
    if (!db) {
      error(message, '', `My records are empty!`);
      return;
    }

    recommendInfo(message, db);
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.code);
  });
}
