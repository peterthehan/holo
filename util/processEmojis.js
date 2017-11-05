const emoji = require('node-emoji');
const { handleBadEmojis, } = require('./handleBadEmojis');

module.exports = {
  aggregateEmojis: (db) => {
    const data = [];
    for (let i of Object.keys(db)) {
      for (let j of Object.keys(db[i].emojis)) {
        data.push(db[i].emojis[j]);
      }
    }

    return data;
  },
  filterEmojisByType: (data, filter) => {
    if (filter === 'all') {
      return data;
    }

    return filter === 'server'
      ? data.filter(i => !i.isDefault)
      : data.filter(i => i.isDefault);
  },
  filterEmojisByUser: (data, user) => {
    return data.filter(i => i.user === user);
  },
  countEmojis: (message, data, filter) => {
    // only consider server emojis that are currently in use
    // by preemptively adding their identifier keys into count
    // this way, if identifier is not in count and is not default, we ignore
    const count = {};
    if (filter !== 'default') {
      const emojis = handleBadEmojis(message);
      for (let i of emojis.keyArray()) {
        count[i] = 0;
      } 
    }

    // count
    for (let i of data) {
      if (!(i.identifier in count)) {
        if (!i.isDefault) {
          continue; // ignore retired server emojis
        }

        count[i.identifier] = 0;
      }

      ++count[i.identifier];
    }

    return count;
  },
  sortEmojis: (count, isDescending) => {
    return Object
      .keys(count)
      .map(i => {
        return { identifier: i, count: count[i], };
      })
      .sort((a, b) => {
        return isDescending ? b.count - a.count : a.count - b.count;
      });
  },
  formatEmojis: (message, sorted) => {
    return sorted.map((i, index) => {
      return `${index + 1}. ` + (emoji.hasEmoji(i.identifier)
        ? emoji.get(i.identifier)
        : message.guild.emojis.get(i.identifier)) + `: ${i.count}`;
    });
  },
}
