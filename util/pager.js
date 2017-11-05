const config = require('../config.json');

// helper functions
function getCurrentPage(arr, page) {
  return arr.slice(page * 10, (page + 1) * 10);
}
function getTotalCount(arr) {
  return arr.reduce((a, b) => a + b.count, 0);
}
function editEmbed(e, data, formatted, page) {
  const currentPage = getCurrentPage(formatted, page);
  const currentCount = getTotalCount(getCurrentPage(data, page));
  const totalCount = getTotalCount(data);

  e.title = `${currentCount} / ${totalCount} (${(currentCount / totalCount * 100).toFixed(2)}%)`;
  e.description = currentPage.join('\n');
  e.footer = { text: `Page ${page + 1}/${Math.ceil(data.length / 10)}`, };
  return e;
}

module.exports = {
  pager: (message, e, data, formatted) => {
    let page = 0; // page number

    message.channel
    .send({ embed: editEmbed(e, data, formatted, page), })
    .then(async (newMessage) => {
      // add arrow_backward, stop_button, arrow_forward reactions
      await newMessage.react('◀');
      await newMessage.react('⏹');
      await newMessage.react('▶');

      // create reactioncollector
      const collector = newMessage.createReactionCollector(
        (reaction, user) => ['◀', '⏹', '▶'].includes(reaction.emoji.name) && user.id !== message.client.user.id,
        { time: parseInt(config.pager_timeout, 10), }
      );

      // collect event handler
      collector.on('collect', (collected) => {
        // remove all non-bot reactions
        collected.users.array().forEach(user => {
          if (user.id !== message.client.user.id) {
            collected.remove(user.id);
          }
        });

        // paging logic
        if (collected._emoji.name === '▶' && page !== Math.ceil(data.length / 10) - 1) {
          ++page;
        } else if (collected._emoji.name === '◀' && page !== 0) {
          --page;
        } else if (collected._emoji.name === '⏹') {
          collector.stop();
        }

        // edit view
        newMessage.edit({ embed: editEmbed(e, data, formatted, page), });
      });

      // end event handler
      collector.on('end', () => newMessage.clearReactions());
    })
    .catch(error => console.log(error));
  },
}
