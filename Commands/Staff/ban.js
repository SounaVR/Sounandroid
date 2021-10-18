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
            Response.setDescription("⛔ You cannot ban yourself.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ You cannot ban someone with a superior role.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.permissions.has(this.permission)) {
            Response.setDescription(`⛔ You cannot ban someone with this \`${this.permission}\` permission.`)
            return interaction.reply({ embeds: [Response] });
        }

        if (Amount > 7) {
            Response.setDescription(`⛔ The number of days to delete messages cannot exceed (0-7d).`)
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

        Response.setDescription(`The member ${Target.user.tag}/${Target.user.id} has been banned for \`${Reason}\``)
        guild.channels.cache.get("892803509806845984").send({ embeds: [Response] });
    }
}