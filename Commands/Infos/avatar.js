const { CommandInteraction, MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Displays the profile picture of someone or you",
    options: [
        {
            name: "target",
            description: "Select a target.",
            type: "USER",
            required: true
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const Target = interaction.options.getUser("target");

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setImage(Target.avatarURL({ dynamic: true, size: 512 })) 
            .setDescription("Profile picture of " + `${Target}`);
    
        interaction.reply({ embeds: [embed] })
    }
};