// helper function
function updateObj(paths, updates) {
  return paths.map((i, index) => {
    return { path: i, updates: updates[index], };
  });
}

module.exports = {
  formatEmojis: (message, identifier, user, isDefault, isReaction) => {
    return {
      identifier: identifier,
      timestamp: message.createdTimestamp,
      user: user,
      channel: message.channel.id,
      isDefault: isDefault,
      isReaction: isReaction,
    };
  },
  formatServerData: (message) => {
    const paths = [
      `guilds/${message.guild.id}`,
      `guilds/${message.guild.id}/channels/${message.channel.id}`,
    ];
    const updates = [
      {
        name: message.guild.name,
        url: message.guild.iconURL,
      },
      {
        name: message.channel.name,
      },
    ];

    return updateObj(paths, updates);
  },
  formatUserData: (message, emojis) => {
    const allUserIds = [message.author.id].concat(emojis.map(i => i.user));
    const uniqueUserIds = [...new Set(allUserIds)]; // remove duplicates

    const paths = uniqueUserIds.map(i => `users/${i}`);
    const updates = uniqueUserIds.map(i => {
      return {
        name: message.guild.members.get(i).user.tag,
        url: message.guild.members.get(i).user.displayAvatarURL,
      };
    });

    return updateObj(paths, updates);
  },
  formatEmojiData: (message, emojis) => {
    // only need name and image data for server emojis
    const filteredServerEmojiIds = emojis.filter(i => !i.isDefault).map(i => i.identifier);
    const uniqueServerEmojiIds = [...new Set(filteredServerEmojiIds)]; // remove duplicates

    const paths = [];
    const updates = [];
    uniqueServerEmojiIds.forEach(i => {
      const emoji = message.guild.emojis.get(i);

      if (emoji) {
        paths.push(`guilds/${message.guild.id}/emojis/${i}`);
        updates.push({ name: emoji.name, url: emoji.url, });
      }
    });

    return updateObj(paths, updates);
  },
};
