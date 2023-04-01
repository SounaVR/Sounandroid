const { ApplicationCommandOptionType , EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "avatar",
        description: "Displays the profile picture of someone or yourself",
        descriptionLocalizations: { fr: "Affiche la photo de profil de quelqu'un ou vous-même" },
        options: [
            {
                name: "member",
                description: "Select a member",
                descriptionLocalizations: { fr: "Sélectionnez un membre" },
                type: ApplicationCommandOptionType.User,
                required: false
            },
        ]
    },
    async execute(client, interaction) {
        let target = interaction.options.getUser("member");
        if (!target) target = interaction.user;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setImage(target.avatarURL({ dynamic: true, size: 512 })) 
            .setDescription("Profile picture of " + `${target}`);
    
        return interaction.reply({ embeds: [embed] });
    }
};