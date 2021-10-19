const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "unmute",
    description: "To unmute someone",
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
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, member, options } = interaction;

        const Target = options.getMember("member");
        const Reason = options.getString("reason") || "Aucune.";
        const Mute = guild.roles.cache.get("899628186541903912");

        const Response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }));

        if (Target.id === member.id) {
            Response.setDescription("⛔ Vous pouvez pas vous auto-unmute.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ Vous pouvez pas unmute quelqu'un avec un rôle supérieur au votre.");
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.permissions.has(this.permission)) {
            Response.setDescription(`⛔ Vous pouvez pas unmute quelqu'un avec la permission \`${this.permission}\`.`);
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
                .setDescription(`Vous avez été unmute par ${member} dans **${guild.name}**\nRaison: ${Reason}`)
        ]}).catch(() => { return; });

        Response.setDescription(`Membre: ${Target} | \`${Target.id}\` a été **unmute**\nPar: ${member} | \`${member.id}\`\nRaison: \`${Reason}\``)
        interaction.reply({ embeds: [Response] });

        if (!Target.roles.cache.has(Mute.id)) return;
        await Target.roles.remove(Mute);

        const logEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("MUTE SYSTEM", guild.iconURL({ dynamic: true }))
            .setDescription(`Membre: ${Target} | \`${Target.id}\` a été **unmute**\Par: ${member} | \`${member.id}\`\nRaison: \`${Reason}\``)
            .setTimestamp()

        client.channels.cache.get("899629148065124434").send({ embeds: [logEmbed] });
    }
}