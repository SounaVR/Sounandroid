const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    name: "emitadd",
    description: "Emits the guildMemberAdd",
    Perms: "ADMINISTRATOR",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute(interaction, client) {
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply({ content: "✅", ephemeral: true });
    }
}