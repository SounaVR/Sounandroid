const { MONGO_URL } = process.env;
const { Events, ActivityType } = require('discord.js');
const roleClaim = require("../utils/reactionRole/role-claim");
const mongoose  = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client is now connected to MongoDB ✅");
        }).catch((err) => {
            console.log(err);
        });
        
        client.user.setActivity('SounaTV', { type: ActivityType.Streaming, url: "https://www.twitch.tv/sounatv" });

        // roleClaim(client);
    
        console.log("Bot ready ✅");
    }
}