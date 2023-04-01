const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../utils/Models/infractions');
const moment = require('moment');

module.exports = {
    data: {
        name: "warn",
        description: "To warn a member",
        descriptionLocalizations: { fr: "Pour avertir un membre" },
        default_member_permissions: (1 << 40),
        options: [
            {
                name: "add",
                description: "Add a warn",
                descriptionLocalizations: { fr: "Ajoute un avertissement" },
                type: ApplicationCommandOptionType.Subcommand,
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
                    }
                ]
            },
            {
                name: "check",
                description: "Displays warnings",
                descriptionLocalizations: { fr: "Affiche les avertissements" },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "member",
                        nameLocalizations: { fr: "membre" },
                        description: "Select a member",
                        descriptionLocalizations: { fr: "Sélectionnez un membre" },
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            },
            {
                name: "delete",
                nameLocalizations: { fr: "supprimer" },
                description: "Removes a specific warning",
                descriptionLocalizations: { fr: "Supprime un avertissement spécifique" },
                type: ApplicationCommandOptionType.Subcommand,
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
                        name: "warnid",
                        description: "Provide the ID of the warn",
                        descriptionLocalizations: { fr: "Fournissez l'ID du warn" },
                        type: ApplicationCommandOptionType.Number,
                        required: true
                    }
                ]
            },
            {
                name: "clear",
                description: "Delete every warnings",
                descriptionLocalizations: { fr: "Supprime tout les avertissements" },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "member",
                        nameLocalizations: { fr: "membre" },
                        description: "Select a member",
                        descriptionLocalizations: { fr: "Sélectionnez un membre" },
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            }
        ]
    },
     /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const { options, member, guild } = interaction;
        const sub = options.getSubcommand();
        const target = options.getMember("member");
        const reason = options.getString("reason");
        const warnID = options.getNumber("warnid") - 1;
        const warnDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");

        const warnEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "Warn System", iconURL: target.user.displayAvatarURL({ dynamic: true }) })   

        switch (sub) {
            case "add":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (!data) {
                        data = new db({
                            GuildID: guild.id,
                            UserID: target.id,
                            UserTag: target.user.tag,
                            WarnData: [
                                {
                                    ExecuterID: interaction.user.id,
                                    ExecuterTag: interaction.user.tag,
                                    Reason: reason,
                                    Date: warnDate
                                }
                            ],
                        })
                    } else {
                        const obj = {
                            ExecuterID: interaction.user.id,
                            ExecuterTag: interaction.user.tag,
                            Reason: reason,
                            Date: warnDate
                        }
                        data.WarnData.push(obj)
                    };
                    data.save();
                });
                
                // Channel send
                warnEmbed.setDescription(`${target} was warned for :\n \`${reason}\``);
                interaction.reply({ embeds: [warnEmbed] });

                // Target's DM
                warnEmbed.setDescription(`You have been warned in \`${guild.name}\` by ${member} for: \`${reason}\``);
                target.send({ embeds: [warnEmbed] });

                // Log channel
                const logEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
                    .setDescription(`Sanction: \`warn\`\nMember: ${target} | \`${target.id}\` has been **warned**\nBy: ${member} | \`${member.id}\`\nReason: \`${reason}\``)
                    .setTimestamp()

                client.channels.cache.find(ch => ch.id === "1091553045080449064").send({ embeds: [logEmbed] });

                break;
            case "check":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                    if (err) throw err;
                    if (data?.WarnData.length > 0 && data) {
                        warnEmbed.setDescription(`${data.WarnData.map(
                            (w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExecuterID}/${w.ExecuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}
                            \n`
                        ).join(" ")}`);
                        interaction.reply({ embeds: [warnEmbed] });
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "delete":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        await data.WarnData.splice(warnID, 1);
                        warnEmbed.setDescription(`${target.user.tag}'s **Warning ID**: "${warnID + 1}" has been deleted.`);
                        interaction.reply({ embeds: [warnEmbed] });
                        await data.save();
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "clear":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        await data.WarnData.splice(0, data.WarnData.length);
                        

                        warnEmbed.setDescription(`The warnings of ${target.user.tag} | ${target.id} has been cleared.`);
                        interaction.reply({ embeds: [warnEmbed] });

                        await data.save();
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
        }
    }
}