require('dotenv').config();
const { BOT_TOKEN } = process.env;
const { Client, Collection } = require('discord.js');

const client = new Client({ intents: 771 });
require('./Handlers/Events')(client);
require('./Handlers/Commands')(client);

client.commands = new Collection();

client.login(BOT_TOKEN);