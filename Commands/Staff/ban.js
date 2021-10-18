const { CommandInteraction, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "ban",
    description: "Bans the target.",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "member",
            description: "Select a member to ban",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason for this ban",
            type: "STRING",
            required: true
        },
        {
            name: "messages",
            description: "Select member of days to delete messages for (0-7d)",
            type: "NUMBER",
            required: true
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, member, options } = interaction;

        const Target = options.getMember("member");
        const Reason = options.getString("reason");
        const Amount = options.getNumber("messages");

        const Response = new MessageEmbed()
            .setColor("RED")
            .setAuthor("BAN SYSTEM", guild.iconURL({ dynamic: true }))

        if (Target.id === member.id) {
            Response.setDescription("⛔ Vous pouvez pas vous auto-ban.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ Vous pouvez pas ban quelqu'un avec un rôle supérieur au votre.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.permissions.has(this.permission)) {
            Response.setDescription(`⛔ Vous pouvez pas ban quelqu'un avec la permission \`${this.permission}\`.`)
            return interaction.reply({ embeds: [Response] });
        }

        if (Amount > 7) {
            Response.setDescription(`⛔ Le nombre de jours ne peut pas excéder (0-7j).`)
            return interaction.reply({ embeds: [Response] });
        }

        await Target.send({ embeds: [
            new MessageEmbed()
                .setColor("RED")
                .setAuthor("BAN SYSTEM", guild.iconURL({ dynamic: true }))
                .setDescription(`You have been banned for \`${Reason}\``)
        ]}).catch(() => { console.log(`Could not send the ban notice to ${Target.user.tag}`) });

        Response.setDescription(`${Target} has been banned for \`${Reason}\``)
        interaction.reply({ embeds: [Response] });

        Target.ban({ days: Amount, reason: Reason })
        .catch((error) => { console.log(error) });

        Response.setDescription(`Le membre ${Target.user.tag}/${Target.user.id} a été banni pour \`${Reason}\``)
        guild.channels.cache.get("899629148065124434").send({ embeds: [Response] });
    }
}