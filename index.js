require('dotenv').config();
const Sounandroid = require('./Classes/Client');

const client = new Sounandroid();

client.login(process.env.BOT_TOKEN);