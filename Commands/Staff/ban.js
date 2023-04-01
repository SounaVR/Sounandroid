const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/Models/infractions');

module.exports = {
    data: {
        name: "ban",
        description: "Ban the selected member",
        descriptionLocalizations: { fr: "Ban le membre sélectionné" },
        default_member_permissions: (1 << 2),
        options: [
            {
                name: "member",
                nameLocalizations: { fr: "membre" },
                description: "Select a member to ban",
                descriptionLocalizations: { fr: "Sélectionnez un membre à ban" },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "reason",
                nameLocalizations: { fr: "raison" },
                description: "Provide a reason for this ban",
                descriptionLocalizations: { fr: "Fournissez une raison pour ce ban" },
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "messages",
                description: "Provide the number of days to be deleted (0-7 days)",
                descriptionLocalizations: { fr: "Fournissez le nombre de jours à supprimer (0-7j)" },
                type: ApplicationCommandOptionType.Number,
                required: true
            },
        ]
    },
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason");
        const amount = options.getNumber("messages");

        const response = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "Ban System", iconURL: guild.iconURL({ dynamic: true }) })

        if (target.id === member.id) {
            response.setDescription("⛔ You can't ban yourself.")
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ You can't ban someone with a role superior to yours.")
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.permissions.has(PermissionFlagsBits.BanMembers)) {
            response.setDescription(`⛔ Vous pouvez pas ban quelqu'un avec la permission: \`${PermissionFlagsBits.BanMembers}\`.`)
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (amount > 7) {
            response.setDescription(`⛔ The number of days cannot exceed 7 days.`)
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        db.findOne({ GuildID: interaction.guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
            if (err) throw err;
            if (!data || !data.BanData) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    UserTag: target.user.tag,
                    BanData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Messages: amount,
                            Reason: reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const banDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Messages: amount,
                    Reason: reason,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.BanData.push(banDataObject);
            }
            data.save();
        });

        await target.send({ embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: "Ban System", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`You have been banned by ${member} in **${guild.name}**\nReason: ${reason}`)
        ]}).catch(() => { return; });

        response.setDescription(`${target} was banned for :\n \`${reason}\``)
        await interaction.reply({ embeds: [response] });

        await target.ban({ days: amount, reason: reason })
        .catch((error) => { console.log(error) });

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Sanction: \`ban\`\nMember: ${target} | \`${target.id}\` has been **banned**\nBy: ${member} | \`${member.id}\`\nReason: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.find(ch => ch.id === "1091553045080449064").send({ embeds: [logEmbed] });
    }
}