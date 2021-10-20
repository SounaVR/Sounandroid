const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/warningDB');

module.exports = {
    name: "warnings",
    description: "To warn someone before mute or ban.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "add",
            description: "Adds a warning.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    description: "Select a target.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "Provide a reason.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "check",
            description: "Checks the warnings.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    description: "Select a target.",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Removes a specific warning.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    description: "Select a target.",
                    type: "USER",
                    required: true
                },
                {
                    name: "warnid",
                    description: "Provide the warning ID.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "clear",
            description: "Clears all warnings.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    description: "Select a target.",
                    type: "USER",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const target = options.getMember("target");
        const reason = options.getString("reason");
        const warnID = options.getNumber("warnid") - 1; 
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();
        const warnEmbed = new MessageEmbed()
            .setTitle("WARNING SYSTEM")
            .setColor("RED")

        switch (sub) {
            case "add":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (!data) {
                        data = new db({
                            GuildID: interaction.guildId,
                            UserID: target.id,
                            UserTag: target.user.tag,
                            Content: [
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
                        data.Content.push(obj)
                    }
                    data.save();
                });
                warnEmbed.setDescription(`Warning added: ${target.user.tag} | ${target.id}\n**Reason**: ${reason}`)
                interaction.reply({ embeds: [warnEmbed] });
                break;
            case "check":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data?.Content.length > 0 && data) {
                        warnEmbed.setDescription(`${data.Content.map(
                            (w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExecuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}
                            \n`
                        ).join(" ")}`);
                        interaction.reply({ embeds: [warnEmbed] });
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "remove":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        data.Content.splice(warnID, 1);
                        warnEmbed.setDescription(`${target.user.tag}'s **Warning ID**: "${warnID + 1}" has been removed.`);
                        interaction.reply({ embeds: [warnEmbed] });
                        data.save();
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
            case "clear":
                db.findOne({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag }, async(err, data) => {
                    if (err) throw err;
                    if (data) {
                        await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: target.id, UserTag: target.user.tag });
                        warnEmbed.setDescription(`${target.user.tag}'s warnings were cleared. | ${target.id}`);
                        interaction.reply({ embeds: [warnEmbed] });
                    } else {
                        warnEmbed.setDescription(`${target.user.tag} | ${target.id} has no warnings.`);
                        interaction.reply({ embeds: [warnEmbed] });
                    };
                });
                break;
        }
    }
}