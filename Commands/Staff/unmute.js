const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: {
        name: "unmute",
        description: "To unmute a member",
        descriptionLocalizations: { fr: "Pour démute un membre" },
        default_member_permissions: (1 << 40),
        options: [
            {
                name: "member",
                nameLocalizations: { fr: "membre" },
                description: "Select a member",
                descriptionLocalizations: { fr: "Sélectionnez un membre" },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "reason",
                nameLocalizations: { fr: "raison" },
                description: "Provide a reason",
                descriptionLocalizations: { fr: "Fournissez une raison" },
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason") || "None";

        const response = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: "Timeout System", iconURL: guild.iconURL({ dynamic: true }) });

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ You can't un-timeout someone with a higher role than yours.");
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            response.setDescription(`⛔ You can't un-timeout someone with permission: \`${PermissionFlagsBits.ModerateMembers}\`.`);
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (!target.isCommunicationDisabled()) {
            response.setDescription(`⛔ You can't un-timeout someone who is not timeout.`);
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        target.send({ embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: "Timeout System", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`You have been un-timeout by ${member} in **${guild.name}**\nReason: \`${reason}\``)
        ]}).catch(() => { return; });

        response.setDescription(`Member: ${target} | \`${target.id}\` has been **un-timeout**\nBy: ${member} | \`${member.id}\`\nReason: \`${reason}\``)
        interaction.reply({ embeds: [response] });

        await target.disableCommunicationUntil(null)

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Sanction: \`un-timeout\`\nMember: ${target} | \`${target.id}\` has been **un-timeout**\nBy: ${member} | \`${member.id}\`\nReason: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.get("1091553045080449064").send({ embeds: [logEmbed] });
    }
}