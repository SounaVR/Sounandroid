const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     */
    execute(member) {
        const memberRole = member.guild.roles.cache.get("898319662675267625");
        member.roles.add(memberRole);

        const welcomeEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("WELCOME", member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Welcome ${member} to the **${member.guild.name}**'s discord server!\nLatest Member Count: **${member.guild.memberCount}**`)
            .setFooter(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("899616418922889246").send({ content: `${member} joined!`, embeds: [welcomeEmbed] })

        const logEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("JOIN", member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member}/${member.user.id} joined.`)
            .setFooter(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("899621885346734110").send({ embeds: [logEmbed] });
        }
}