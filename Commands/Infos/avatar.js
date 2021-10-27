const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Affiche la photo de profil de quelqu'un ou vous-même",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur.",
            type: "USER",
            required: true
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const target = interaction.options.getUser("membre");

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setImage(target.avatarURL({ dynamic: true, size: 512 })) 
            .setDescription("Photo de profil de " + `${target}`);
    
        interaction.reply({ embeds: [embed] })
    }
};