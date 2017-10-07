const Discord = require('discord.js');
const firebase = require('firebase');
const config = require('./config.json');
const firebaseConfig = require('./firebase.json');

// initialize firebase
firebase.initializeApp(firebaseConfig);

// create bot
const client = new Discord.Client();

// load event handlers
require('./util/loadEvents.js')(client);

client.login(config.token);
