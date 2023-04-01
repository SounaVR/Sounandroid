const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/Models/infractions');

module.exports = {
    data: {
        name: "kick",
        description: "Kick the selected member",
        descriptionLocalizations: { fr: "Kick le membre sélectionné" },
        default_member_permissions: (1 << 1),
        options: [
            {
                name: "member",
                nameLocalizations: { fr: "membre" },
                description: "Select a member to kick",
                descriptionLocalizations: { fr: "Sélectionnez un membre à kick" },
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "reason",
                nameLocalizations: { fr: "raison" },
                description: "Provide a reason for this kick",
                descriptionLocalizations: { fr: "Fournissez une raison pour ce kick" },
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason");

        const response = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "Kick System", iconURL: guild.iconURL({ dynamic: true }) })

        if (target.id === member.id) {
            response.setDescription("⛔ You can't kick yourself.")
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ You can't kick someone with a role superior to yours.")
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.permissions.has(PermissionFlagsBits.BanMembers)) {
            response.setDescription(`⛔ Vous pouvez pas kick quelqu'un avec la permission: \`${PermissionFlagsBits.BanMembers}\`.`)
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        db.findOne({ GuildID: interaction.guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
            if (err) throw err;
            if (!data || !data.KickData) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    UserTag: target.user.tag,
                    KickData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Reason: reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const kickDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Reason: reason,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.KickData.push(kickDataObject);
            }
            data.save();
        });

        await target.send({ embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: "Kick System", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`You have been kicked by ${member} in **${guild.name}**\nReason: ${reason}`)
        ]}).catch(() => { return; });

        response.setDescription(`${target} was kicked for :\n \`${reason}\``)
        await interaction.reply({ embeds: [response] });

        await target.kick({ reason: reason })
        .catch((error) => { console.log(error) });

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Sanction: \`kick\`\nMember: ${target} | \`${target.id}\` has been **kicked**\nBy: ${member} | \`${member.id}\`\nReason: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.find(ch => ch.id === "1091553045080449064").send({ embeds: [logEmbed] });
    }
}