const { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD } = process.env;
const { Client } = require('discord.js');
const mysql = require('mysql');
const cron = require('cron');
const fs = require('fs');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        const con = mysql.createConnection({
            multipleStatements: true,
            encoding: 'utf8',
            charset: 'utf8mb4',
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        client.connection = con;
        
        const rdy = client.channels.cache.find(ch => ch.id === "900032797375352852");

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