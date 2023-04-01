const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../utils/Models/infractions');

module.exports = {
    data: {
        name: "modlogs",
        description: "Displays the violations of the selected member",
        descriptionLocalizations: { fr: "Affiche les infractions du membre sélectionné" },
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
                name: "check",
                description: "Select a specific type of infraction to display",
                descriptionLocalizations: { fr: "Sélectionnez un type spécifique d'infraction à afficher" },
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "ALL",
                        value: "all"
                    },
                    {
                        name: "WARNINGS",
                        value: "warnings"
                    },
                    {
                        name: "BANS",
                        value: "bans"
                    },
                    {
                        name: "KICKS",
                        value: "kicks"
                    },
                    {
                        name: "MUTES",
                        value: "mutes"
                    }
                ]
            }
        ]
    },
    async execute(client, interaction) {
        const { guild, options } = interaction;

        const target = options.getMember("member");
        const choice = options.getString("check");

        const response = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "Mod logs", iconURL: guild.iconURL({ dynamic: true }) })

        switch (choice) {
            case "all":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        const warns = data.WarnData.length;
                        const bans = data.BanData.length;
                        const kicks = data.KickData.length;
                        const mutes = data.MuteData.length;

                        response.setDescription(`Member: ${target} | ${target.id}\n
                        **Warnings**: ${warns}\n**Bans**: ${bans}\n**Kicks**: ${kicks}\n**Mutes**: ${mutes}`)
                        interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} has no infractions.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "warnings" :
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.WarnData.length < 1) {
                            response.setDescription(`${target} has no warnings.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Warnings of : ${target} | ${target.id}\n
                        ` + `${data.WarnData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Reason**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} has no warnings.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "bans":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.BanData.length < 1) {
                            response.setDescription(`${target} has no bans.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Bans of : ${target} | ${target.id}\n
                        ` + `${data.BanData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Reason**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} has no bans.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "kicks":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.KickData.length < 1) {
                            response.setDescription(`${target} has no kicks.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Kicks of : ${target} | ${target.id}\n
                        ` + `${data.KickData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Reason**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} has no kicks.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
            case "mutes":
                db.findOne({ GuildID: guild.id, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.MuteData.length < 1) {
                            response.setDescription(`${target} has no mutes.`);
                        interaction.reply({ embeds: [response] });
                        }
                        response.setDescription(`Mutes of : ${target} | ${target.id}\n
                        ` + `${data.MuteData.map((w, i) => `**ID**: ${i + 1}\n**Date**: ${w.Date}\n**Staff**: ${w.ExecuterID}/${w.ExecuterTag}\n**Reason**: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`);
                        return interaction.reply({ embeds: [response] });
                    } else {
                        response.setDescription(`${target} has no mutes.`);
                        interaction.reply({ embeds: [response] });
                    }
                })
                break;
        }
    }
}