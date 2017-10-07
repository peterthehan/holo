module.exports = {
  formatEmojis: (message, emojis, isDefault, isReaction) => {
    return emojis.map(i => {
      return {
        identifier: i,
        timestamp: parseInt(message.createdTimestamp, 10),
        user: parseInt(message.author.id, 10),
        channel: parseInt(message.channel.id, 10),
        isDefault: isDefault,
        isReaction: isReaction,
      };
    });
  },
  formatServerData: (message, emojis) => {
    const filteredServerEmojis = emojis.filter(i => !i.isDefault).map(i => i.identifier);
    const emojiPaths = filteredServerEmojis.map(i => `guilds/${message.guild.id}/emojis/${i}`);
    const emojiUpdates = filteredServerEmojis.map(i => {
      return {
        name: message.guild.emojis.get(i).name,
        url: message.guild.emojis.get(i).url,
      };
    });

    const paths = [
      `users/${message.author.id}`,
      `guilds/${message.guild.id}`,
      `guilds/${message.guild.id}/channels/${message.channel.id}`,
    ].concat(emojiPaths);
    const updates = [
      {
        name: message.author.tag,
        url: message.author.displayAvatarURL,
      },
      {
        name: message.guild.name,
        url: message.guild.iconURL,
      },
      {
        name: message.channel.name,
      },
    ].concat(emojiUpdates);

    return paths.map((i, index) => {
      return {
        path: i,
        updates: updates[index],
      };
    });
  },
}
