const config = require('../config.json');

exports.run = (message, args) => {
  const e = {
    title: message.client.user.username,
    description: `Made with ❤ by ${message.guild.members.get(config.owner_id)} (${message.guild.members.get(config.owner_id).user.tag}).`,
    thumbnail: { url: message.client.user.avatarURL, },
    fields: [
      {
        name: 'Join Server',
        value: '[idk](https://discord.gg/WjEFnzC)',
        inline: true,
      },
      {
        name: 'GitHub',
        value: '[/peterthehan/holo](https://github.com/peterthehan/holo)',
        inline: true,
      },
    ],
  };

  message.channel.send({ embed: e, });
}
