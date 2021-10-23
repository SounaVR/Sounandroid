require('moment-duration-format');
const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { checkDays } = require('../../utils/function');
const moment = require('moment');

module.exports = {
    name: "botinfo",
    description: "Affiche les informations à propos du bot",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const uptime = moment.duration(client.uptime).format("DD [days], HH [hrs], mm [mins], ss [secs]");
        const creationDate = moment(client.user.createdAt).format("DD/MM/YYYY");
        const developer = client.users.cache.find(user => user.id === "899618699743461386");
        const boticon = client.user.avatarURL();
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, boticon)
            .setColor("GREEN")
            .setThumbnail(boticon)
            .addField("⚒ Développeur", developer.tag)
    
            .addField("🕒 Temps allumé", uptime, true)
            .addField("💻 Framework", "Node.js", true)
            .addField("🌐 API", "discord.js", true)
    
            .addField("🧠 Mémoire utilisée", Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", true)
            .addField("🏠 Serveurs", client.guilds.cache.size.toString(), true)
            .addField("👥 Utilisateurs", client.users.cache.size.toString(), true)
    
            .addField("📎 Mon lien", "[Clique pas](https://media.discordapp.net/attachments/706350683766390854/845538726162989076/3237789807_1_3_brmovBmI.png)", true)
            .addField("🗓 Date de création", `${creationDate}\n${checkDays(client.user.createdAt)}`, true)
    
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp();
    
        interaction.reply({ embeds: [embed] })
    }
}