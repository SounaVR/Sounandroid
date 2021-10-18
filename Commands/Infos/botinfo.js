require('moment-duration-format');
const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
const { checkDays } = require('../../utils/function');
const moment = require('moment');

module.exports = {
    name: "botinfo",
    description: "Displays bot information",
    category: "Infos",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const uptime = moment.duration(client.uptime).format("DD [days], HH [hrs], mm [mins], ss [secs]");
        const creationDate = moment(client.user.createdAt).format("DD/MM/YYYY");
        const developer = client.users.cache.find(user => user.id === "868676208412471327");
        const boticon = client.user.avatarURL();
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, boticon)
            .setColor("GREEN")
            .setThumbnail(boticon)
            .addField("⚒ Developer", developer.tag)
    
            .addField("🕒 Uptime", uptime, true)
            .addField("💻 Framework", "Node.js", true)
            .addField("🌐 API", "discord.js", true)
    
            .addField("🧠 Memory Used", Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + " Mb", true)
            .addField("🏠 Servers", client.guilds.cache.size.toString(), true)
            .addField("👥 Users", client.users.cache.size.toString(), true)
    
            .addField("📎 My link", "[Don't click](https://media.discordapp.net/attachments/706350683766390854/845538726162989076/3237789807_1_3_brmovBmI.png)", true)
            .addField("🗓 Creation Date", `${creationDate}\n${checkDays(client.user.createdAt)}`, true)
    
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp();
    
        interaction.reply({ embeds: [embed] })
    }
}