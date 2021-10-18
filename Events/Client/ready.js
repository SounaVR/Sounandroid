const { Client } = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        const rdy = client.channels.cache.find(ch => ch.id === "899619905626837042");

        // --------------------
        // CRON MEMO
        // ^ ^ ^ ^ ^ ^
        // | | | | | |
        // | | | | | jour de la semaine
        // | | | | mois
        // | | | jour du mois
        // | | heures
        // | minutes
        // secondes (optional)

        client.user.setActivity("les vidéos de Souna", { type: "WATCHING" });
        client.user.setStatus("dnd");
        console.log(`Logged in as ${client.user.tag}`);
        rdy.send(`✅ Bot connecté et prêt !`);
    }
}