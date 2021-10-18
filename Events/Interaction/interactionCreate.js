const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { getPlayer, getUser } = require('../../utils/function');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("⛔ An error occurred while running this command.")
            ]}) && client.commands.delete(interaction.commandName);

            const arguments = [];

            for (let option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    option.options?.foreach((x) => {
                        if (x.value) arguments.push(option.value);
                    });
                } else if (option.value) arguments.push(option.value);
            };

            command.execute(interaction, client, getPlayer, getUser, arguments);
        }
    }
}