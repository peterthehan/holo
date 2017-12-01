const config = require('../config.json');

exports.run = (message, args) => {
  const cmds = {
    'Bot': [
      'about',
      'help',
      'ping',
    ],
    'Database': [
      'count',
      'rate',
      'users',
    ],
    'Miscellaneous': [
      'emojis',
    ],
  };

  const e = {
    title: 'Commands',
    description: `Prefix: ${[config.prefix, message.client.user,].filter(i => i).join(', ')}`,
    fields: Object.keys(cmds).map(i => {
      return { name: i, value: cmds[i].join(', '), };
    }),
  };

  message.channel.send({ embed: e, });
}
