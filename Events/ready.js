const { MONGO_URL } = process.env;
const { Events, ActivityType } = require('discord.js');
const mongoose  = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("The client is now connected to MongoDB ✅");
        }).catch((err) => {
            console.log(err);
        });
        
        client.user.setActivity('SounaTV', { type: ActivityType.Streaming, url: "https://www.twitch.tv/sounatv" });
    
        console.log("Bot ready ✅");
    }
}