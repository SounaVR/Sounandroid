const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        const memberRole = member.guild.roles.cache.get("1091545267242811483");
        await member.roles.add(memberRole);

        const welcomeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: "WELCOME !", iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Welcome ${member} on the server **${member.guild.name}**!\nTotal members: **${member.guild.memberCount}**`)
            .setFooter({ text: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        member.guild.channels.cache.get("1091547018813521981").send({ content: `${member} joined!`, embeds: [welcomeEmbed] })
    }
}