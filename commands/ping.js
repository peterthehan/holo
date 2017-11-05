exports.run = (message, args) => {
  let e = { description: 'Pinging...', };

  message.channel
    .send({ embed: e, })
    .then(newMessage => {
      e = {
        title: 'Pong! 🏓',
        fields: [
          {
            name: 'HTTP ping',
            value: `${newMessage.createdTimestamp - message.createdTimestamp} ms`,
            inline: true,
          },
        ],
      };

      newMessage.edit({ embed: e, });
    })
    .catch(error => console.log(error));
}
