const { MONGO_URL } = process.env;
const { Events, ActivityType } = require('discord.js');
const mongoose  = require('mongoose');
const axios = require('axios');

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

        // Monitoring stuff | Uptime Kuma
        setInterval(() => {
            axios({
                method: 'get',
                url: `http://192.168.0.16:3001/api/push/gzlHoDwFAt?status=up&msg=OK&ping=${client.ws.ping}`
            });
        }, 30000);
        
        client.user.setActivity('SounaTV', { type: ActivityType.Streaming, url: "https://www.twitch.tv/sounatv" });
    
        console.log("Bot ready ✅");
    }
}