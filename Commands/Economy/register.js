const { CommandInteraction, Client } = require('discord.js');
const insert_data = require('../../utils/insert/insert_data');

module.exports = {
    name: "register",
    description: "Register to the bot database",
    category: "Economy",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, getPlayer) {
        const databaseLogs = client.channels.cache.find(channel => channel.id === "899619905626837042");

        const con = client.connection;
        const userid = interaction.user.id.toString();
        const player = await getPlayer(con, userid);

        if (!player) {
            insert_data(client, con, player, interaction, databaseLogs, userid);

            interaction.reply("You are now registered. Enjoy!\nDo `z!help` to display the list of commands.");
        } else {
            interaction.reply("You are already registered.");
        }
    } 
}