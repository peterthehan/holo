const emoji = require('node-emoji');

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
  filterEmojisByField: (data, field, filter) => {
    return data.filter(i => i[field] === filter);
  },
  countData: (data, field) => {
    const count = {};
    for (let i of data) {
      if (!count[i[field]]) {
        count[i[field]] = 0;
      }

      ++count[i[field]];
    }

    return count;
  },
  filterData: (message, count, filter) => {
    const emojis = message.guild.emojis;
    
    // ensure all current server emojis are represented
    if (filter !== 'default') {
      for (let i of emojis.keyArray()) {
        if (!count[i]) {
          count[i] = 0;
        }
      }
    }

    // remove retired server emojis
    for (let i of Object.keys(count)) {
      if (!emoji.hasEmoji(i) && !emojis.has(i)) {
        delete count[i];
      }
    }

    return count;
  },
  calculateRate: (message, c) => {
    // todo: handle case for when bot leaves guild and rejoins
    const count = Object.assign({}, c);

    for (let i of Object.keys(count)) {
      // convert ms to days
      const time = (Date.now() - (emoji.hasEmoji(i)
        ? message.guild.members.get(message.client.user.id).joinedTimestamp
        : message.guild.emojis.get(i).createdTimestamp)) / 86400000;

      count[i] = +(count[i] / time).toFixed(2);
    }

    return count;
  },
  sortData: (count, isDescending) => {
    return Object
      .keys(count)
      .map(i => {
        return { identifier: i, count: count[i], };
      })
      .sort((a, b) => {
        return isDescending ? b.count - a.count : a.count - b.count;
      });
  },
  getTotalCount: (sorted) => {
    return sorted.reduce((a, b) => a + b.count, 0);
  },
  formatEmojis: (message, sorted) => {
    return sorted.map((i, index) => {
      return `${index + 1}. ` + (emoji.hasEmoji(i.identifier)
        ? emoji.get(i.identifier)
        : message.guild.emojis.get(i.identifier)) + `: ${i.count}`;
    });
  },
  formatUsers: (message, sorted) => {
    return sorted
      .filter(i => message.guild.members.get(i.identifier)) // remove nonexistent members
      .map((i, index) => {
        const user = message.guild.members.get(i.identifier).user;
        return `${index + 1}. ${user} (${user.tag}): ${i.count}`;
      });
  },
};
