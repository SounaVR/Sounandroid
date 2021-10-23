const { CommandInteraction, MessageAttachment } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const file = new MessageAttachment('./utils/assets/cat-ping.gif');
        interaction.reply({ content: `${client.ws.ping}ms.`, files: [file] })
    }
}