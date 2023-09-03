const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        // Roles
        const viewer = member.guild.roles.cache.get("1091545267242811483");
        // Roles Dividers
        const twitch = member.guild.roles.cache.get("1147956198356828271");
        const kofi = member.guild.roles.cache.get("1147955858605609130");
        const server = member.guild.roles.cache.get("1147956557926125659");
        const bottom = member.guild.roles.cache.get("1147956671520444559");

        const rolesArray = [viewer, twitch, kofi, server, bottom];

        await member.roles.add(rolesArray);

        const welcomeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: "WELCOME !", iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Welcome ${member} on the server **${member.guild.name}**!\nTotal members: **${member.guild.memberCount}**`)
            .setFooter({ text: `${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        member.guild.channels.cache.get("1091547018813521981").send({ content: `${member} joined!`, embeds: [welcomeEmbed] })
    }
}