const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: "clear",
        description: "Purge a number of messages",
        descriptionLocalizations: { fr: "Purge un certain nombre de messages" },
        default_member_permissions: (1 << 13),
        options: [
            {
                name: "amount",
                nameLocalizations: { fr: "montant" },
                description: "Provide an amount",
                descriptionLocalizations: { fr: "Fournissez un montant" },
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: "member",
                nameLocalizations: { fr: "membre" },
                description: "Select a member",
                descriptionLocalizations: { fr: "Sélectionnez un membre" },
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    async execute(client, interaction) {
        const logChannel = client.channels.cache.find(ch => ch.id === "1091553045080449064");
        const { guild, channel, member, options } = interaction;

        const amount = options.getInteger('amount');
        const target = options.getUser('member');

        const messages = await channel.messages.fetch({
            limit: amount +1
        });

        const clearEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "Clear System", iconURL: guild.iconURL({ dynamic: true }) })
            .setTimestamp()

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: "MODERATION LOG", iconURL: guild.iconURL({ dynamic: true }) })
            .setTimestamp()

        
        if (target) {
            let i = 0;
            const filtered = [];

            await messages.filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                clearEmbed.setDescription(`Successfully deleted ${messages.size} messages from ${target}.`);
                logEmbed.setDescription(`Sanction: \`clear\`\nMessages: \`${messages.size}\`\nIn: ${channel.name}\nMember: ${target} | \`${target.id}\` \nBy: ${member} | \`${member.id}\``)

                interaction.reply({ embeds: [clearEmbed] });
                logChannel.send({ embeds: [logEmbed] });
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                clearEmbed.setDescription(`Successfully deleted ${messages.size} messages from this channel.`);
                logEmbed.setDescription(`Sanction: \`clear\`\nMessages: \`${messages.size}\`\nIn: ${channel}\nBy: ${member} | \`${member.id}\``)

                interaction.reply({ embeds: [clearEmbed] });
                logChannel.send({ embeds: [logEmbed] });
            });
        }   
    }
}