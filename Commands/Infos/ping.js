const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Displays the bot latency",
    /**
     * @param {CommandInteraction} interaction
     */
    execute(interaction, client) {
        interaction.reply({ embeds: [
            new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`🏓 ${client.ws.ping}ms`)
        ]});
    }
}