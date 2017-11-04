module.exports = {
  log: (message) => {
    console.log(`${message.guild.name}#${message.channel.name}|${message.author.tag}: ${message.content}`);
  },
  emojiLog: (message, emojis, type) => {
    console.log(`  ${type} Emojis (${emojis.length}): ${emojis.map(i => i.isDefault ? i.identifier : message.guild.emojis.get(i.identifier).name).join(' ')}`);
  },
}