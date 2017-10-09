module.exports = {
  log: (message, emojis, type) => {
    console.log('********************************************************************************');
    console.log(`${message.guild.name}|${message.channel.name}|${message.author.tag}: ${message.content}`);
    console.log(`${type} Emojis (${emojis.length}): ${emojis.map(i => i.isDefault ? i.identifier : message.guild.emojis.get(i.identifier).name).join(' ')}`);
  },
}