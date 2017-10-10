const Discord = require('discord.js');
const admin = require('firebase-admin');
const config = require('./config.json');
const serviceAccount = require('./serviceAccountKey.json');

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
});

// create bot
const client = new Discord.Client();

// load event handlers
require('./util/loadEvents.js')(client);

client.login(config.token);
