const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "sql",
    description: "Modify the database",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "request",
            description: "Do a request to the database",
            type: "STRING",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const con = client.connection;
        const request = interaction.options.getString("request");

        con.query(request, (err, result) => {
            if (err) throw err;
            interaction.reply("OkPacket " + JSON.stringify(result, null, " "));
        });
    }
};