const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "userinfo",
    type: "USER",
    /**
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const response = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField("ID", `${target.user.id}`)
            .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "Aucun"}`)
            .addField("Membre depuis", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField("Utilisateur Discord depuis", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({ embeds: [response], ephemeral: true });
    }
}