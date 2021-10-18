const { CommandInteraction, MessageEmbed, Client } = require('discord.js');
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
        const Mute = guild.roles.cache.get("897862389242941522");

        const Response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }));

        if (Target.id === member.id) {
            Response.setDescription("⛔ You cannot mute yourself.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ You cannot mute someone with a superior role than you.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.permissions.has(this.permission)) {
            Response.setDescription(`⛔ You cannot mute someone with the \`${this.permission}\` permission.`);
            return interaction.reply({ embeds: [Response] });
        }

        if (!Mute) {
            Response.setDescription(`⛔ The mute role was not found.`);
            return interaction.reply({ embeds: [Response] });
        }

        Target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }))
                .setDescription(`You have been muted by ${member} in **${guild.name}**\nReasion: ${Reason}\nDuration: ${Duration}`)
        ]}).catch(() => {
            console.log(`Could not send the mute notice to ${Target.user.tag}.`);
        });

        Response.setDescription(`Member: ${Target} | \`${Target.id}\` has been **muted**\nStaff: ${member} | \`${member.id}\`\nDuration: \`${Duration}\`\nReason: \`${Reason}\``)
        interaction.reply({ embeds: [Response] });

        await Target.roles.add(Mute.id);
        setTimeout(async () => {
            if (!Target.roles.cache.has(Mute.id)) return;
            await Target.roles.remove(Mute);
        }, ms(Duration));
    }
}