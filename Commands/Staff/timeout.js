const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/Models/infractions');
const ms = require('ms');

module.exports = {
    data: {
        name: "timeout",
        description: "To mute a member",
        descriptionLocalizations: { fr: "Pour mute un membre" },
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
                required: true
            },
            {
                name: "duration",
                nameLocalizations: { fr: "durée" },
                description: "Select a duration",
                descriptionLocalizations: { fr: "Sélectionnez une durée" },
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "30 minutes",
                        value: "30m"
                    },
                    {
                        name: "1 hour",
                        value: "1h"
                    },
                    {
                        name: "3 hours",
                        value: "3h"
                    },
                    {
                        name: "1 day",
                        value: "1d"
                    },
                ]
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("member");
        const reason = options.getString("reason");
        const duration = options.getString("duration");

        const response = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: "Timeout System", iconURL: guild.iconURL({ dynamic: true }) });

        if (target.id === member.id) {
            response.setDescription("⛔ you can't timeout yourself.");
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.roles.highest.position > member.roles.highest.position) {
            response.setDescription("⛔ You can't timeout someone with a higher role than yours.");
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            response.setDescription(`⛔ You can't timeout someone with permission: \`${PermissionFlagsBits.ModerateMembers}\`.`);
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        if (target.isCommunicationDisabled()) {
            response.setDescription(`⛔ You can't timeout someone who is already timeout.`);
            return interaction.reply({ embeds: [response], ephemeral: true });
        }

        db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    UserTag: target.user.tag,
                    MuteData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Reason: reason,
                            Duration: duration,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ]
                })
            } else {
                const muteDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Reason: reason,
                    Duration: duration,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.MuteData.push(muteDataObject);
            }
            data.save();
        });

        target.send({ embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: "Timeout System", iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`You have been timeout by ${member} in **${guild.name}**\nReason: \`${reason}\`\nDuration: \`${duration}\``)
        ]}).catch(() => { return; });

        response.setDescription(`Member: ${target} | \`${target.id}\` has been **timeout**\nBy: ${member} | \`${member.id}\`\nDuration: \`${duration}\`\nReason: \`${reason}\``)
        interaction.reply({ embeds: [response] });

        await target.timeout(ms(duration), reason);

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Sanction: \`mute\`\nMember: ${target} | \`${target.id}\` has been **timeout**\nBy: ${member} | \`${member.id}\`\nDuration: \`${duration}\`\nReason: \`${reason}\``)
            .setTimestamp()

        client.channels.cache.get("1091553045080449064").send({ embeds: [logEmbed] });
    }
}