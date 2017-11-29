const { error, } = require('../util/log');

exports.run = (message, args) => {
  const guild = message.guild;

  if (!guild || !guild.available) {
    error(message, 'Error', `Server information unavailable.`);
    return;
  }

  let emojis = guild.emojis;

  if (!emojis.size) {
    error(message, '', `${guild.name} has no server emojis to list!`);
    return;
  }

  const e = {
    title: `${guild.name}'s server emoji list (${emojis.size})`,
    description: emojis.array().join(' '),
  };

  message.channel.send({ embed: e, });
}