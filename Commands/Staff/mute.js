const { CommandInteraction, MessageEmbed, Client, Message } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "mute",
    description: "To mute someone",
    permission: "MUTE_MEMBERS",
    options: [
        {
            name: "member",
            description: "Select a member",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason",
            type: "STRING",
            required: true
        },
        {
            name: "duration",
            description: "Select a duration",
            type: "STRING",
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
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, member, options } = interaction;

        const Target = options.getMember("member");
        const Reason = options.getString("reason");
        const Duration = options.getString("duration");
        const Mute = guild.roles.cache.get("899628186541903912");

        const Response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }));

        if (Target.id === member.id) {
            Response.setDescription("⛔ Vous pouvez pas vous auto-mute.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ Vous pouvez pas mute quelqu'un avec un rôle supérieur au votre.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.permissions.has(this.permission)) {
            Response.setDescription(`⛔ Vous pouvez pas mute quelqu'un avec la permission \`${this.permission}\`.`);
            return interaction.reply({ embeds: [Response] });
        }

        if (!Mute) {
            Response.setDescription(`⛔ Le rôle mute n'a pas été trouvé.`);
            return interaction.reply({ embeds: [Response] });
        }

        Target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }))
                .setDescription(`Vous avez été mute par ${member} dans **${guild.name}**\nRaison: ${Reason}\nDurée: ${Duration}`)
        ]}).catch(() => { return; });

        Response.setDescription(`Member: ${Target} | \`${Target.id}\` a été **mute**\nPar: ${member} | \`${member.id}\`\nDurée: \`${Duration}\`\nRaison: \`${Reason}\``)
        interaction.reply({ embeds: [Response] });

        await Target.roles.add(Mute.id);
        setTimeout(async () => {
            if (!Target.roles.cache.has(Mute.id)) return;
            await Target.roles.remove(Mute);
        }, ms(Duration));

        const logEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }))
            .setDescription(`Member: ${Target} | \`${Target.id}\` a été **mute**\Par: ${member} | \`${member.id}\`\nDurée: \`${Duration}\`\nRaison: \`${Reason}\``)
            .setTimestamp()

        client.channels.cache.get("899629148065124434").send({ embeds: [logEmbed] });
    }
}