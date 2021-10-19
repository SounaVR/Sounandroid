const { DBURL } = process.env;
const { Client } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        mongoose.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client is now connected to the database ✅");
        }).catch((err) => {
            console.log(err);
        });
        const rdy = client.channels.cache.find(ch => ch.id === "900032797375352852");

        client.user.setActivity("les vidéos de Souna", { type: "WATCHING" });
        client.user.setStatus("dnd");
        rdy.send(`✅ Bot connecté et prêt !`);
    }
}