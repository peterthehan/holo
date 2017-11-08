module.exports = (client) => {
  const items = ['apples', 'wheat', 'coins', 'beer', 'my tail',];
  const index = new Date().getDate() % items.length;
  client.user.setGame(`with ${items[index]}.`);
  console.log(`${client.user.tag}: Ready`);
}
