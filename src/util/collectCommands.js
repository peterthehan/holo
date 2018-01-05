const config = require('../config.json');
const { log, } = require('./log');

module.exports = {
  collectCommands: (message) => {
    const mentionRegExp = RegExp(`^<@!?${message.client.user.id}>`);
    const noPrefix = !config.prefix || !message.content.startsWith(config.prefix);
    const noMention = !mentionRegExp.test(message.content);

    // ignore if not a command
    if (noPrefix && noMention) {
      return;
    }

    // parse message into command and arguments
    let args;
    let command;
    if (noMention) {
      args = message.content.split(' ');
      command = args.shift().slice(config.prefix.length).toLowerCase();
    } else {
      args = message.content.replace(mentionRegExp, '').trim().split(' ');
      command = args.shift().toLowerCase();
    }

    // check if command file exists
    try {
      log(message);
      require(`../commands/${command}`).run(message, args);
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
    }
  },
};
