// handle Discord bug, remove module when bug is fixed
module.exports = {
  handleBadEmojis: (message) => {
    // 2BLewd, ShinobuNyan, FeelsBadYukko
    const badEmojis = ['360381896603074561', '360381897085288469', '360381897278488586',];

    return message.guild.id === '258167954913361930' // cqdb
      ? message.guild.emojis.filter(i => !badEmojis.includes(i.id))
      : message.guild.emojis;
  },
}
