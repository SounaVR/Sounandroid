const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: "WELCOME !", iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Welcome ${member} on the server **${member.guild.name}**!\nTotal members: **${member.guild.memberCount}**`)
            .setFooter({ text: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        member.guild.channels.cache.get("1065830709652103168").send({ content: `${member} joined!`, embeds: [welcomeEmbed] })
    }
}