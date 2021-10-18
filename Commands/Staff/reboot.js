const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "reboot",
    description: "Restart the bot",
    permission: "ADMINISTRATOR",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        interaction.reply({ content:"⚙ Redémarrage en cours...", ephemeral: true }).then(() => {
            process.exit();
        });
    }
};